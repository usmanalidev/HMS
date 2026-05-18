/**
 * ROLE: Application authentication state and session lifecycle.
 * WHEN IT RUNS: Root-injected; restores session on init; used by guards and login flows.
 * WHAT IT DOES: Manages user/tokens via signals + BehaviorSubject; login/logout/refresh RBAC.
 */

import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, of, switchMap, tap, throwError } from 'rxjs';

import { ROUTE_PATHS } from '../constants/routes.constant';
import { ROLE_PERMISSIONS, type Permission } from '../constants/roles.constant';
import { STORAGE_KEYS } from '../constants/storage-keys.constant';
import type { LoginRequest, LoginResponse, TokenPair } from '../models/auth.model';

/** Shape returned by mock-api `server.js` login/refresh endpoints. */
interface MockAuthApiResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
import { User, UserRole } from '../models/user.model';
import { ApiService } from './api.service';
import { LoggerService } from './logger.service';
import { TokenService } from './token.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly tokenService = inject(TokenService);
  private readonly router = inject(Router);
  private readonly logger = inject(LoggerService);

  /** Modern reactive state (Angular signals). */
  private readonly currentUserSignal = signal<User | null>(null);

  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  /**
   * Legacy Observable stream for components still using async pipe on Subject.
   * Learning note: prefer signals for new code; keep Subject for gradual migration.
   */
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.restoreSession();
  }

  login(credentials: LoginRequest): Observable<User> {
    return this.api.post<MockAuthApiResponse>('/auth/login', credentials).pipe(
      map((response) => this.toLoginResponse(response)),
      tap((response) => this.handleAuthSuccess(response)),
      map((response) => response.user),
      catchError((err) => {
        this.logger.error('Login failed', err);
        return throwError(() => err);
      }),
    );
  }

  logout(navigateToLogin = true): void {
    this.clearSession();
    if (navigateToLogin) {
      void this.router.navigate([ROUTE_PATHS.login]);
    }
  }

  refreshToken(): Observable<TokenPair> {
    const refresh = this.tokenService.getRefreshToken();
    if (!refresh) {
      return throwError(() => new Error('No refresh token available'));
    }
    return this.api.post<MockAuthApiResponse>('/auth/refresh', { refreshToken: refresh }).pipe(
      map((response) => this.toTokenPair(response)),
      tap((tokens) => this.tokenService.setTokens(tokens)),
      catchError((err) => {
        this.logger.warn('Refresh token failed — logging out');
        this.logout();
        return throwError(() => err);
      }),
    );
  }

  hasRole(role: UserRole | UserRole[] | string): boolean {
    const user = this.currentUserSignal();
    if (!user) {
      return false;
    }
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  }

  /** Used by *appHasRole structural directive (RoleChecker contract). */
  hasAnyRole(roles: string[]): boolean {
    return this.hasRole(roles as UserRole[]);
  }

  hasPermission(permission: Permission): boolean {
    const user = this.currentUserSignal();
    if (!user) {
      return false;
    }
    const allowed = ROLE_PERMISSIONS[user.role] ?? [];
    return allowed.includes(permission);
  }

  /** Demo login when backend is unavailable (json-server learning path). */
  loginWithMockUser(user: User): void {
    const tokens: TokenPair = {
      accessToken: this.tokenService.createMockJwt({
        sub: user.id,
        email: user.email,
        role: user.role,
      }),
      refreshToken: this.tokenService.createMockJwt({
        sub: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 86400,
      }),
      expiresIn: 3600,
      tokenType: 'Bearer',
    };
    this.handleAuthSuccess({ user, tokens });
  }

  /** Mock API returns flat tokens; map to internal LoginResponse shape. */
  private toLoginResponse(response: MockAuthApiResponse): LoginResponse {
    return {
      user: response.user,
      tokens: this.toTokenPair(response),
    };
  }

  private toTokenPair(response: MockAuthApiResponse): TokenPair {
    return {
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      expiresIn: 900,
      tokenType: 'Bearer',
    };
  }

  private handleAuthSuccess(response: LoginResponse): void {
    this.tokenService.setTokens(response.tokens);
    this.persistUser(response.user);
    this.setCurrentUser(response.user);
    this.logger.log('Session established for', response.user.email);
  }

  private restoreSession(): void {
    const raw = sessionStorage.getItem(STORAGE_KEYS.USER);
    const access = this.tokenService.getAccessToken();
    if (!raw || !access || this.tokenService.isTokenExpired(access)) {
      this.clearSession();
      return;
    }
    try {
      const user = JSON.parse(raw) as User;
      this.setCurrentUser(user);
      this.logger.log('Session restored for', user.email);
    } catch {
      this.clearSession();
    }
  }

  private persistUser(user: User): void {
    sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  private setCurrentUser(user: User | null): void {
    this.currentUserSignal.set(user);
    this.currentUserSubject.next(user);
  }

  private clearSession(): void {
    sessionStorage.removeItem(STORAGE_KEYS.USER);
    this.tokenService.clearTokens();
    this.setCurrentUser(null);
  }

  /** Ensures valid access token before guarded navigation (used by error interceptor). */
  ensureValidToken(): Observable<boolean> {
    const token = this.tokenService.getAccessToken();
    if (token && !this.tokenService.isTokenExpired(token)) {
      return of(true);
    }
    return this.refreshToken().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false)),
    );
  }
}

/**
 * ROLE: Low-level JWT/token persistence and payload inspection.
 * WHEN IT RUNS: Used by AuthService and auth/error interceptors on every secured request.
 * WHAT IT DOES: Reads/writes tokens in sessionStorage and decodes JWT payload (base64 mock).
 */

import { Injectable } from '@angular/core';

import { STORAGE_KEYS } from '../constants/storage-keys.constant';
import type { JwtPayload, TokenPair } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class TokenService {
  getAccessToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  setTokens(tokens: TokenPair): void {
    sessionStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    sessionStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  clearTokens(): void {
    sessionStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Decodes JWT payload without verifying signature (learning/demo only).
   * Real apps should validate tokens on the server; client decode is for UX only.
   */
  decodePayload(token: string): JwtPayload | null {
    try {
      const parts = token.split('.');
      const payloadSegment = parts[1];
      if (parts.length < 2 || !payloadSegment) {
        return null;
      }
      const normalized = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=');
      const json = atob(padded);
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  /** Returns true if token missing, malformed, or past `exp` claim. */
  isTokenExpired(token: string | null = this.getAccessToken()): boolean {
    if (!token) {
      return true;
    }
    const payload = this.decodePayload(token);
    if (!payload?.exp) {
      return true;
    }
    const nowSeconds = Math.floor(Date.now() / 1000);
    return payload.exp <= nowSeconds;
  }

  /** Builds a mock JWT for json-server demos (header.payload.signature). */
  createMockJwt(payload: Omit<JwtPayload, 'iat' | 'exp'> & { exp?: number }): string {
    const header = { alg: 'none', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload: JwtPayload = {
      ...payload,
      iat: now,
      exp: payload.exp ?? now + 3600,
    };
    const encode = (obj: object): string =>
      btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return `${encode(header)}.${encode(fullPayload)}.mock-signature`;
  }
}

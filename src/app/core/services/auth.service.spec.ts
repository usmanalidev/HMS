/**
 * LEARNING: Service unit tests verify business logic without the DOM.
 * Test AuthService role checks and session state in isolation using TestBed.
 */
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';

import { UserRole } from '../models/user.model';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        TokenService,
        provideRouter([]),
        {
          provide: ApiService,
          useValue: {
            post: () =>
              of({
                accessToken: 'a',
                refreshToken: 'r',
                user: {
                  id: '1',
                  email: 'admin@metrohealth.org',
                  firstName: 'Admin',
                  lastName: 'User',
                  role: UserRole.Admin,
                  department: 'IT',
                  isActive: true,
                },
              }),
          },
        },
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should start unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
  });

  it('hasRole returns false when logged out', () => {
    expect(service.hasRole(UserRole.Admin)).toBe(false);
  });

  it('login sets authenticated user', async () => {
    const user = await firstValueFrom(
      service.login({ email: 'admin@metrohealth.org', password: 'admin123' }),
    );
    expect(user.role).toBe(UserRole.Admin);
    expect(service.isAuthenticated()).toBe(true);
  });
});

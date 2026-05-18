/**
 * ROLE: Types for authentication API contracts and JWT structure.
 * WHEN IT RUNS: Used by AuthService, TokenService, and auth-related interceptors.
 * WHAT IT DOES: Models login payloads, token pairs, and decoded JWT claims.
 */

import type { User } from './user.model';

/** Credentials sent to POST /auth/login. */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

/** Successful login response from the backend. */
export interface LoginResponse {
  user: User;
  tokens: TokenPair;
}

/** Access + refresh token bundle stored in sessionStorage. */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

/**
 * Decoded JWT payload (claims).
 * Learning note: real JWTs are signed; we only decode the payload for UI/expiry checks.
 */
export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  iss?: string;
}

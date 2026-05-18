/**
 * ROLE: Standard API envelope types for consistent HTTP responses.
 * WHEN IT RUNS: Wrapped by ApiService and consumed by feature services/components.
 * WHAT IT DOES: Defines generic success/error wrappers and paginated list shape.
 */

/** Standard single-resource API response from the backend. */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  timestamp?: string;
}

/** Paginated list response for tables (patients, appointments, etc.). */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** Builds an empty paginated shell (useful for loading states). */
export function emptyPaginated<T>(): PaginatedResponse<T> {
  return {
    items: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
  };
}

/**
 * ROLE: Staff user listing for admin user management.
 * WHEN IT RUNS: Injected by UserListComponent and UserDetailResolver.
 * WHAT IT DOES: GET /users with server pagination and search (mock-api custom route).
 */

import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiService } from '../../../core/services/api.service';
import type { PaginatedResponse } from '../../../core/models/api-response.model';
import type { User } from '../../../core/models/user.model';

export interface UsersQueryParams {
  page?: number;
  limit?: number;
  q?: string;
}

interface UsersApiResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = inject(ApiService);

  getUsers(params: UsersQueryParams = {}): Observable<PaginatedResponse<User>> {
    const page = params.page ?? 1;
    const limit = params.limit ?? 10;

    return this.api
      .getRaw<UsersApiResponse>('/users', {
        _page: page,
        _limit: limit,
        q: params.q,
      })
      .pipe(
        map((response) => ({
          items: response.data,
          total: response.meta.total,
          page: response.meta.page,
          pageSize: response.meta.limit,
          totalPages: response.meta.totalPages,
          hasNext: response.meta.page < response.meta.totalPages,
          hasPrevious: response.meta.page > 1,
        })),
      );
  }

  getUserById(id: string): Observable<User> {
    return this.getUsers({ limit: 100 }).pipe(
      map((result) => {
        const user = result.items.find((u) => u.id === id);
        if (!user) {
          throw new Error(`User ${id} not found`);
        }
        return user;
      }),
    );
  }
}

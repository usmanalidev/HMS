/**
 * ROLE: Typed HTTP wrapper around Angular HttpClient.
 * WHEN IT RUNS: Injected by feature services for all REST calls to `environment.apiUrl`.
 * WHAT IT DOES: Provides get/post/put/patch/delete with ApiResponse<T> typing and base URL.
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import type { ApiResponse } from '../models/api-response.model';

type QueryParams = Record<string, string | number | boolean | undefined>;

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http
      .get<ApiResponse<T>>(this.url(path), { params: this.toHttpParams(params) })
      .pipe(map((res) => this.unwrap(res)));
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .post<ApiResponse<T>>(this.url(path), body)
      .pipe(map((res) => this.unwrap(res)));
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .put<ApiResponse<T>>(this.url(path), body)
      .pipe(map((res) => this.unwrap(res)));
  }

  patch<T>(path: string, body: unknown): Observable<T> {
    return this.http
      .patch<ApiResponse<T>>(this.url(path), body)
      .pipe(map((res) => this.unwrap(res)));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<ApiResponse<T>>(this.url(path))
      .pipe(map((res) => this.unwrap(res)));
  }

  /** Raw GET without ApiResponse unwrap (for json-server flat arrays). */
  getRaw<T>(path: string, params?: QueryParams): Observable<T> {
    return this.http.get<T>(this.url(path), { params: this.toHttpParams(params) });
  }

  private url(path: string): string {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalized}`;
  }

  private unwrap<T>(response: ApiResponse<T> | T): T {
    if (response !== null && typeof response === 'object' && 'data' in response) {
      return (response as ApiResponse<T>).data;
    }
    return response as T;
  }

  private toHttpParams(params?: QueryParams): HttpParams | undefined {
    if (!params) {
      return undefined;
    }
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}

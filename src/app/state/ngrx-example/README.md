# NgRx in the Healthcare Management System

This folder documents **when** to reach for NgRx. The app does **not** install `@ngrx/store` by default — use Angular **signals** (`AuthState`, `UiState`) and services for most features.

## When signals + services are enough

- Auth session, sidebar, and global loading (see `../auth.state.ts`, `../ui.state.ts`)
- Single-screen forms and lists with local component state
- Server data fetched per route with `HttpClient` + `resource()` or signals

## When to consider NgRx

| Scenario | Why NgRx helps |
|----------|----------------|
| Many components read/write the same complex entity graph | Single source of truth, predictable updates |
| Undo/redo, time-travel debugging, audit trails | Actions + reducers model events explicitly |
| Cross-cutting workflows (e.g. admit patient → bed assignment → billing) | Effects orchestrate multiple APIs |
| Role-based UI driven by large shared state trees | Selectors memoize derived data |

## Optional action stubs (documentation only)

If you later add NgRx, actions might look like:

```typescript
// patients.actions.ts (stub — not wired)
export const PatientsActions = {
  loadList: '[Patients] Load List',
  loadListSuccess: '[Patients] Load List Success',
  loadListFailure: '[Patients] Load List Failure',
  selectPatient: '[Patients] Select Patient',
} as const;
```

```typescript
// auth.actions.ts (stub — prefer AuthState today)
export const AuthActions = {
  login: '[Auth] Login',
  loginSuccess: '[Auth] Login Success',
  loginFailure: '[Auth] Login Failure',
  logout: '[Auth] Logout',
  refreshToken: '[Auth] Refresh Token',
} as const;
```

## Recommended path

1. Start with **feature services** + **signal facades** (current approach).
2. Introduce NgRx **per feature** (e.g. `patients/store`) only when shared mutable state becomes hard to trace.
3. Keep auth in `AuthState` unless multiple effects must coordinate tokens across modules.

## Install (only when needed)

```bash
ng add @ngrx/store
ng add @ngrx/effects
ng add @ngrx/entity   # optional, for normalized patient/appointment lists
```

Do not duplicate `AuthState` in the store unless you have a concrete orchestration need.

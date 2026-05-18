# Architecture Guide

## Design principles

This project follows **enterprise Angular architecture**:

1. **Separation of concerns** — core vs shared vs features
2. **Lazy loading** — features load on demand (smaller initial bundle)
3. **Single responsibility** — services own data; components own UI
4. **Unidirectional data flow** — API → service → signal/Observable → template
5. **Security in depth** — guards (route) + interceptors (HTTP) + directives (UI)

## Folder structure

```
src/
├── environments/          # Build-time config (apiUrl, production flag)
├── app/
│   ├── core/              # App-wide singletons — import only from core
│   │   ├── constants/     # Roles, routes, storage keys
│   │   ├── guards/        # authGuard, roleGuard, guestGuard
│   │   ├── interceptors/  # auth, error, logging, cache
│   │   ├── models/        # TypeScript interfaces
│   │   └── services/      # ApiService, AuthService, etc.
│   ├── shared/            # Reusable, domain-agnostic UI
│   │   ├── components/    # data-table, page-header, skeleton
│   │   ├── directives/    # *appHasRole, highlight
│   │   ├── pipes/         # fullName, timeAgo
│   │   └── utils/         # validators, rxjs helpers
│   ├── features/          # Business domains (lazy loaded)
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── patients/
│   │   ├── users/
│   │   ├── reports/
│   │   ├── settings/
│   │   └── notifications/
│   ├── state/             # Signal facades (optional layer over services)
│   ├── layouts/           # Shell components with router-outlet
│   ├── app.config.ts      # Root providers
│   └── app.routes.ts      # Route tree
└── styles.scss            # Global + Material theme
```

## Layer rules

| Layer | Can import from | Cannot import from |
|-------|-----------------|-------------------|
| **core** | core only | features, shared components |
| **shared** | core, shared | features |
| **features** | core, shared, same feature | other features |
| **layouts** | core, shared | features (except via router) |

## Smart vs presentational components

```
┌─────────────────────────────────────┐
│  UserListComponent (SMART)          │
│  - injects UserService              │
│  - handles search/pagination        │
│  - passes data @Input to table      │
└──────────────┬──────────────────────┘
               │ [data], [columns]
               ▼
┌─────────────────────────────────────┐
│  DataTableComponent (DUMB)          │
│  - OnPush change detection          │
│  - @Input / @Output only            │
│  - no services, no HTTP             │
└─────────────────────────────────────┘
```

## State management strategy

| Tool | Used for | Example |
|------|----------|---------|
| **Signals** | Synchronous UI state | `AuthService.currentUser`, `ThemeService.theme` |
| **RxJS Observables** | HTTP streams, complex async | `UserService.getUsers()`, `login()` |
| **BehaviorSubject** | Legacy bridge / multi-subscriber | `AuthService.currentUser$` |
| **AuthState facade** | Component-friendly API | `AuthState.login()` |
| **NgRx** (documented only) | Very large apps with time-travel debugging | See `state/ngrx-example/README.md` |

**Rule of thumb:** Start with services + signals. Add NgRx when multiple features need the same complex state with strict audit requirements.

## Security architecture

```
User clicks route
       │
       ▼
  authGuard ──► token valid? ──no──► /auth/login?returnUrl=...
       │ yes
       ▼
  roleGuard ──► role in data.roles? ──no──► toast + /dashboard
       │ yes
       ▼
  Component loads
       │
       ▼
  HTTP request ──► authInterceptor adds Bearer
       │
       ▼
  errorInterceptor ──► 401? try refresh ──► fail? logout
```

## Performance patterns

- **Lazy routes** — `loadChildren` / `loadComponent`
- **OnPush** — presentational components
- **trackBy** — `*ngFor` / `@for` in lists
- **debounceTime** — search inputs (`shared/utils/rxjs-operators.ts`)
- **HTTP cache** — `cacheInterceptor` for GET `/reports`
- **Skeleton loaders** — perceived performance during fetch

## Testing strategy

| What to test | Why |
|--------------|-----|
| Services | Business logic, auth, API mapping |
| Guards | Access rules with mocked AuthService |
| Pipes/Directives | Pure transform / DOM behavior |
| Smart components | Integration with mocked services |
| Dumb components | Input → output rendering |

See `auth.service.spec.ts` for a service test example.

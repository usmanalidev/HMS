# Angular Concepts — Learning Reference

Simple explanations with **where this project demonstrates each concept**.

---

## Standalone components

**What:** Components that declare their own imports — no `NgModule`.

**Why:** Less boilerplate, better tree-shaking, Angular's default since v19+.

**Here:** Every `.component.ts` uses `standalone: true`.

---

## Dependency Injection (DI)

**What:** Angular creates and injects class instances for you.

**How:** `inject(AuthService)` or constructor injection.

**Scopes:**
| Scope | How |
|-------|-----|
| Root singleton | `@Injectable({ providedIn: 'root' })` |
| Route scoped | `providers: [MyService]` on route |
| Component scoped | `providers` on `@Component` |

**Here:** `AuthService`, `ApiService` are root; see `app.config.ts` for tokens like `ROLE_CHECKER`.

---

## Signals vs RxJS

| | Signals | RxJS Observables |
|---|---------|------------------|
| **Best for** | UI state, computed values | HTTP, websockets, complex streams |
| **Sync read** | `user()` yes | needs subscribe/async pipe |
| **Operators** | `computed()` | `map`, `switchMap`, `debounceTime` |
| **Here** | `AuthService.currentUser` | `login()`, `UserService.getUsers()` |

**When both:** Use signal for template state, Observable for HTTP, convert at boundary with `toSignal()`.

---

## Routing

| Concept | File |
|---------|------|
| Route config | `app.routes.ts`, `*.routes.ts` |
| Lazy load | `loadChildren`, `loadComponent` |
| Guards | `core/guards/auth.guard.ts` |
| Resolvers | `features/users/resolvers/user-detail.resolver.ts` |
| Route data | `data: { roles: [UserRole.Admin] }` |

---

## Reactive forms

**What:** Form built in TypeScript with `FormBuilder`, validators, valueChanges.

**Here:**
- `features/auth/login` — login form
- `features/patients/patient-form` — create/edit patient
- `features/settings/dynamic-form` — fields generated from config array

**Validators:** `shared/utils/form-validators.ts`

---

## HTTP & interceptors

**What:** Middleware for every HTTP request/response.

**Here:**
- `auth.interceptor.ts` — JWT header
- `error.interceptor.ts` — 401 refresh + toasts
- `logging.interceptor.ts` — console trace
- `cache.interceptor.ts` — GET cache demo

---

## Pipes

Transform template values. **Pure pipes** run only when inputs change.

| Pipe | Purpose |
|------|---------|
| `fullName` | Combine first + last |
| `timeAgo` | Relative time |
| `roleLabel` | Admin → Administrator |

---

## Directives

| Type | Example |
|------|---------|
| Structural | `*appHasRole="'admin'"` |
| Attribute | `appHighlight`, `appAutofocus` |

---

## Lifecycle hooks

| Hook | When | Demo |
|------|------|------|
| `ngOnInit` | After first inputs set | All feature components |
| `ngOnDestroy` | Before destroy | Unsubscribe patterns |
| `ngOnChanges` | Input changes | Documented in patient-form |

---

## Change detection

| Strategy | When to use |
|----------|-------------|
| Default | Simple components |
| OnPush | Presentational / perf-critical |

**Here:** `DataTableComponent`, `PageHeaderComponent` use OnPush.

---

## Role-based access (RBAC)

Three layers:
1. **Menu** — `MenuService` filters items by role
2. **Route** — `roleGuard` + `data.roles`
3. **Template** — `*appHasRole="'admin'"`

---

## Testing

```typescript
TestBed.configureTestingModule({
  providers: [
    AuthService,
    { provide: ApiService, useValue: mockApi },
  ],
});
```

**Test:** Logic in services and guards. **Don't over-test:** Material internals, Angular framework.

---

## NgRx — when to add it

Use NgRx when:
- 10+ components share complex state
- You need action history / time-travel debugging
- Multiple teams need strict state contracts

**Don't use for:** Simple CRUD apps — services + signals are enough.

See: `src/app/state/ngrx-example/README.md`

---

## Quick reference diagram

```
┌──────────────────────────────────────────────────────────┐
│                     Angular App                          │
│  ┌─────────┐   ┌──────────┐   ┌─────────────────────┐  │
│  │ Template│◄──│ Component│◄──│ Service / State     │  │
│  └─────────┘   └────┬─────┘   └──────────┬──────────┘  │
│                     │                     │              │
│                     │ Router              │ HttpClient   │
│                     ▼                     ▼              │
│              ┌──────────┐         ┌─────────────┐      │
│              │  Guards  │         │ Interceptors│      │
│              └──────────┘         └──────┬──────┘      │
└──────────────────────────────────────────│──────────────┘
                                           ▼
                                      Backend API
```

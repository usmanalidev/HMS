# Healthcare Management System (HMS)

Enterprise-grade **Angular 21** learning application that demonstrates production architecture, not just CRUD. Built as a senior-level template for understanding the **complete Angular flow**.

## What you will learn

| Topic | Where to look |
|-------|----------------|
| Bootstrap & DI | `src/main.ts`, `src/app/app.config.ts` |
| Routing & lazy loading | `src/app/app.routes.ts`, `src/app/features/*/ *.routes.ts` |
| Guards & resolvers | `src/app/core/guards/`, `src/app/features/users/resolvers/` |
| HTTP interceptors | `src/app/core/interceptors/` |
| JWT auth + refresh | `src/app/core/services/auth.service.ts`, `mock-api/server.js` |
| Signals vs RxJS | `src/app/core/services/auth.service.ts`, `src/app/state/` |
| Smart vs dumb components | `features/users/user-list` vs `shared/components/data-table` |
| Reactive & dynamic forms | `features/patients/patient-form`, `features/settings/dynamic-form` |
| RBAC & role menu | `core/services/menu.service.ts`, `shared/directives/has-role.directive.ts` |
| Change detection (OnPush) | Most feature + shared components |
| Unit testing | `*.spec.ts` files |

## Quick start

```bash
# Install dependencies
npm install

# Terminal 1 — mock API (port 3000)
npm run mock:api

# Terminal 2 — Angular app (port 4200)
npm start

# Or both together:
npm run start:dev
```

Open **http://localhost:4200**

## Demo credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@metrohealth.org` | `admin123` |
| Doctor | `doctor@metrohealth.org` | `doctor123` |
| Nurse | `nurse@metrohealth.org` | `nurse123` |
| Receptionist | `receptionist@metrohealth.org` | `receptionist123` |

## Application features

- **Authentication** — JWT login, refresh token, session restore
- **Dashboard** — KPI cards, activity feed
- **Patients** — list, search, create/edit, detail
- **Users** (admin) — paginated table, resolver, role guard
- **Reports** — HTTP caching demo
- **Settings** — profile form, theme toggle, dynamic form builder
- **Notifications** — inbox from API
- **RBAC** — dynamic sidebar by role, `*appHasRole` directive

## Project structure

```
src/app/
├── core/           # Singleton services, guards, interceptors (loaded once)
├── shared/         # Reusable UI — no business logic
├── features/       # Lazy-loaded domain modules
├── state/          # Signal facades (+ NgRx guidance)
├── layouts/        # Main shell & auth shell
└── environments/   # API URLs per build target
```

## Learning path (recommended order)

1. Read `docs/ANGULAR_CONCEPTS.md` — mental model
2. Trace startup in `docs/FLOW_EXPLANATION.md`
3. Login as **admin** → explore all menu items
4. Login as **nurse** → notice hidden admin routes
5. Open DevTools → Network tab → watch interceptors on API calls
6. Read inline comments in `core/interceptors/` and `core/guards/`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Mock API + Angular together |
| `npm run mock:api` | JSON mock server only |
| `npm start` | Angular dev server |
| `npm run build` | Production build |
| `npm test` | Unit tests (Vitest) |
| `npm run lint` | ESLint |

## Documentation

- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) — folder structure & patterns
- [FLOW_EXPLANATION.md](./docs/FLOW_EXPLANATION.md) — request/render/route lifecycles
- [ANGULAR_CONCEPTS.md](./docs/ANGULAR_CONCEPTS.md) — concepts cheat sheet

## Tech stack

- Angular 21 (standalone, signals, functional guards/interceptors)
- Angular Material
- RxJS 7
- TypeScript strict mode
- json-server mock API
- Vitest for unit tests
- ESLint + Prettier

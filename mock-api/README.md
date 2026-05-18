# Healthcare Mock API

JSON Server–based mock backend for local development.

## Quick start

From the **project root** (dependencies are hoisted to the main `package.json`):

```bash
npm run mock:api
```

Or from this folder:

```bash
node server.js
```

Default URL: `http://localhost:3000`

## Merge into root `package.json`

Add these scripts to the root `package.json` (user merge):

```json
{
  "scripts": {
    "mock:api": "node mock-api/server.js",
    "start:dev": "concurrently -n api,web -c blue,green \"npm run mock:api\" \"npm run start\""
  }
}
```

`concurrently` and `json-server` are already listed in the root dependencies.

## Demo credentials

| Role          | Email                         | Password        |
|---------------|-------------------------------|-----------------|
| Admin         | admin@metrohealth.org         | admin123        |
| Doctor        | doctor@metrohealth.org        | doctor123       |
| Nurse         | nurse@metrohealth.org         | nurse123        |
| Receptionist  | receptionist@metrohealth.org  | receptionist123 |

Passwords are stored as demo bcrypt-like strings: `$2b$10$demo$<password>`.

## Endpoints

| Method | Path           | Description                                      |
|--------|----------------|--------------------------------------------------|
| POST   | `/auth/login`  | `{ email, password }` → tokens + user            |
| POST   | `/auth/refresh`| `{ refreshToken }` → new tokens + user           |
| GET    | `/users`       | Paginated search: `_page`, `_limit`, `q`         |
| *      | `/patients`    | JSON Server CRUD (10 records)                    |
| *      | `/appointments`| JSON Server CRUD (8 records)                     |
| *      | `/notifications` | JSON Server CRUD (5 records)                   |
| *      | `/reports`     | JSON Server CRUD (3 records)                     |

### Example: login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"doctor@metrohealth.org\",\"password\":\"doctor123\"}"
```

### Example: list users

```bash
curl "http://localhost:3000/users?_page=1&_limit=5&q=cardiology"
```

## Files

- `db.json` — seed data
- `server.js` — custom auth + users routes, then JSON Server CRUD
- `routes.json` — reference only (routing is handled in `server.js`)

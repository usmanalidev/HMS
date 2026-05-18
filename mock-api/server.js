import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { App } from '@tinyhttp/app';
import { cors } from '@tinyhttp/cors';
import { json } from 'milliparsec';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { createApp } from 'json-server/lib/app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_FILE = join(__dirname, 'db.json');
const PORT = Number(process.env['PORT'] ?? 3000);
const HOST = process.env['HOST'] ?? 'localhost';

/** Demo bcrypt-like hashes: `$2b$10$demo$<plainPassword>` */
function verifyDemoPassword(passwordHash, plainPassword) {
  return passwordHash === `$2b$10$demo$${plainPassword}`;
}

function createFakeJwt(payload) {
  const header = Buffer.from(
    JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
  ).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = Buffer.from(`demo-signature-${Date.now()}`).toString(
    'base64url',
  );
  return `${header}.${body}.${signature}`;
}

function sanitizeUser(user) {
  const { passwordHash: _passwordHash, ...safe } = user;
  return safe;
}

/** @type {Map<string, { userId: string; expiresAt: number }>} */
const refreshTokenStore = new Map();

function setupDatabase() {
  if (!existsSync(DB_FILE)) {
    throw new Error(`Database file not found: ${DB_FILE}`);
  }
  const adapter = new JSONFile(DB_FILE);
  return new Low(adapter, {});
}

const db = setupDatabase();
await db.read();

const api = createApp(db);
const app = new App();

app.use((req, res, next) =>
  cors({
    allowedHeaders: req.headers['access-control-request-headers']
      ?.split(',')
      .map((h) => h.trim()),
  })(req, res, next),
);
app.options('*', cors());
app.use(json());

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const user = db.data.users?.find(
    (u) => u.email.toLowerCase() === String(email).toLowerCase(),
  );
  if (!user || !verifyDemoPassword(user.passwordHash, password)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }
  if (!user.isActive) {
    res.status(403).json({ error: 'Account is disabled' });
    return;
  }

  const now = Date.now();
  const accessToken = createFakeJwt({
    sub: user.id,
    role: user.role,
    exp: Math.floor((now + 15 * 60 * 1000) / 1000),
  });
  const refreshToken = createFakeJwt({
    sub: user.id,
    type: 'refresh',
    exp: Math.floor((now + 7 * 24 * 60 * 60 * 1000) / 1000),
  });

  refreshTokenStore.set(refreshToken, {
    userId: user.id,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  });
});

app.post('/auth/refresh', (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken) {
    res.status(400).json({ error: 'refreshToken is required' });
    return;
  }

  const session = refreshTokenStore.get(refreshToken);
  if (!session || session.expiresAt < Date.now()) {
    refreshTokenStore.delete(refreshToken);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
    return;
  }

  const user = db.data.users?.find((u) => u.id === session.userId);
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  const now = Date.now();
  const accessToken = createFakeJwt({
    sub: user.id,
    role: user.role,
    exp: now + 15 * 60 * 1000,
  });
  const newRefreshToken = createFakeJwt({
    sub: user.id,
    type: 'refresh',
    exp: now + 7 * 24 * 60 * 60 * 1000,
  });

  refreshTokenStore.delete(refreshToken);
  refreshTokenStore.set(newRefreshToken, {
    userId: user.id,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    refreshToken: newRefreshToken,
    user: sanitizeUser(user),
  });
});

app.get('/users', (req, res) => {
  const page = Math.max(1, parseInt(req.query['_page'] ?? '1', 10) || 1);
  const limit = Math.max(
    1,
    parseInt(req.query['_limit'] ?? req.query['_per_page'] ?? '10', 10) || 10,
  );
  const q = String(req.query['q'] ?? '')
    .trim()
    .toLowerCase();

  let users = (db.data.users ?? []).map(sanitizeUser);

  if (q) {
    users = users.filter((u) => {
      const haystack = [
        u.firstName,
        u.lastName,
        u.email,
        u.role,
        u.department,
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }

  const total = users.length;
  const start = (page - 1) * limit;
  const data = users.slice(start, start + limit);

  res.json({
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

app.use(api);

app.listen(PORT, () => {
  console.log(`Healthcare mock API running at http://${HOST}:${PORT}`);
  console.log('Auth: POST /auth/login, POST /auth/refresh');
  console.log('Users: GET /users?_page=1&_limit=10&q=cardiology');
  console.log('CRUD: /patients, /appointments, /notifications, /reports');
});

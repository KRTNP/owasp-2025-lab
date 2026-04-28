const crypto = require('crypto');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.APP_PORT || 7500;
const INTERNAL = process.env.INTERNAL_API_URL || 'http://internal-api:9100';

const users = {
  analyst: { password: 'analyst123', role: 'user' },
  operator: { password: 'operator123', role: 'user' },
  admin: { password: 'neon_admin_2025', role: 'admin' }
};

const FLAG_STAGE1 = 'FLAG{proxy_foothold}';
const TOKEN_SECRET = 'neon-signing-secret';
const elevated = new Set();

function sign(data) {
  return crypto.createHmac('sha256', TOKEN_SECRET).update(data).digest('hex').slice(0, 16);
}

function mkToken(username) {
  const role = users[username].role;
  const ts = String(Date.now());
  const raw = `${username}:${role}:${ts}`;
  const sig = sign(raw);
  return Buffer.from(`${raw}:${sig}`).toString('base64url');
}

function parseToken(token) {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const [username, role, ts, sig] = raw.split(':');
    if (!users[username] || !role || !ts || !sig) return null;
    const expected = sign(`${username}:${role}:${ts}`);
    if (expected !== sig) return null;
    return { username, role };
  } catch {
    return null;
  }
}

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : '';
  const user = parseToken(token);
  if (!user) return res.status(401).json({ error: 'auth required' });
  req.user = user;
  next();
}

function isInternal(req) {
  const xff = String(req.headers['x-forwarded-for'] || '');
  const firstHop = xff.split(',')[0].trim();
  return firstHop === '127.0.0.1' || firstHop === '::1';
}

app.get('/', (_req, res) => {
  res.json({ name: 'Neon Proxy', note: 'challenge service online' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users[username];
  if (!user || user.password !== password) return res.status(401).json({ error: 'invalid credentials' });
  return res.json({ token: mkToken(username) });
});

app.get('/api/me', auth, (req, res) => {
  res.json({ user: req.user.username, role: req.user.role, badge: FLAG_STAGE1 });
});

app.post('/api/profile/note', auth, (req, res) => {
  const note = String((req.body || {}).note || '');
  if (note.includes('#approve-admin')) {
    elevated.add(req.user.username);
  }
  res.json({ saved: true, len: note.length });
});

app.all('/proxy/*', auth, async (req, res) => {
  const path = '/' + req.params[0];

  if (path.startsWith('/admin') && !isInternal(req)) {
    return res.status(403).json({ error: 'admin path restricted to internal proxy' });
  }

  const forwardHeaders = {
    'x-auth-user': req.user.username,
    'x-auth-role': req.user.role,
    'content-type': req.headers['content-type'] || 'application/json'
  };

  if (elevated.has(req.user.username)) {
    forwardHeaders['x-auth-debug'] = 'elevated-user';
  }
  if (req.headers['x-forwarded-host']) {
    forwardHeaders['x-forwarded-host'] = req.headers['x-forwarded-host'];
  }

  const url = `${INTERNAL}${path}`;
  const method = req.method;
  const body = ['GET', 'HEAD'].includes(method) ? undefined : JSON.stringify(req.body || {});

  const upstream = await fetch(url, { method, headers: forwardHeaders, body });
  const text = await upstream.text();
  res.status(upstream.status);
  res.set('content-type', upstream.headers.get('content-type') || 'application/json');
  res.send(text);
});

app.get('/root-vault', auth, async (req, res) => {
  const opsKey = String(req.headers['x-ops-key'] || '');
  if (!opsKey) return res.status(403).json({ error: 'missing ops key' });

  const upstream = await fetch(`${INTERNAL}/admin/root-vault`, {
    headers: {
      'x-auth-user': req.user.username,
      'x-auth-role': req.user.role,
      'x-ops-key': opsKey,
      'x-auth-debug': elevated.has(req.user.username) ? 'elevated-user' : ''
    }
  });
  const text = await upstream.text();
  res.status(upstream.status);
  res.set('content-type', upstream.headers.get('content-type') || 'application/json');
  res.send(text);
});

app.listen(PORT, () => {
  console.log(`neon-proxy app listening on ${PORT}`);
});

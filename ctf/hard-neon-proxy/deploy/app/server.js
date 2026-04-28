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

const flags = {
  stage1: 'FLAG{proxy_foothold}',
  final: 'FLAG{neon_root}'
};

function mkToken(username) {
  return Buffer.from(`${username}:${users[username].role}`).toString('base64url');
}

function parseToken(token) {
  try {
    const raw = Buffer.from(token, 'base64url').toString('utf8');
    const [username, role] = raw.split(':');
    if (!users[username]) return null;
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
  // Vulnerable trust: attacker can spoof X-Forwarded-For
  const xff = String(req.headers['x-forwarded-for'] || '');
  const firstHop = xff.split(',')[0].trim();
  return firstHop === '127.0.0.1' || firstHop === '::1';
}

app.get('/', (_req, res) => {
  res.json({
    name: 'Neon Proxy',
    note: 'HTB-style hard challenge',
    endpoints: ['/login', '/api/me', '/proxy/*', '/root-vault']
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'invalid credentials' });
  }
  return res.json({ token: mkToken(username) });
});

app.get('/api/me', auth, (req, res) => {
  res.json({ user: req.user.username, role: req.user.role, flag: flags.stage1 });
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

  // Vulnerable trust boundary: forwarded host is accepted by internal service.
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
  const opsKey = req.headers['x-ops-key'];
  if (!opsKey) return res.status(403).json({ error: 'missing ops key' });

  const upstream = await fetch(`${INTERNAL}/admin/root-vault`, {
    headers: {
      'x-auth-user': req.user.username,
      'x-auth-role': req.user.role,
      'x-ops-key': String(opsKey)
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

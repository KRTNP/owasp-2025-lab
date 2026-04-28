const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.APP_PORT || 7600;
const INTERNAL = process.env.INTERNAL_API_URL || 'http://internal-api:9200';

const users = {
  player: { password: 'player123', role: 'user' },
  admin: { password: 'cache_admin_2025', role: 'admin' }
};

const docs = {
  'player-note': { owner: 'player', text: 'Personal recon journal' },
  'admin-secrets': { owner: 'admin', text: 'FLAG{key_confusion}' },
  'root-vault': { owner: 'admin', text: 'vault placeholder' }
};

const cache = new Map();

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

app.get('/', (_req, res) => {
  res.json({
    name: 'Cerberus Cache',
    endpoints: ['/login', '/api/me', '/api/doc/:id', '/api/bot/prime', '/api/root']
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users[username];
  if (!user || user.password !== password) return res.status(401).json({ error: 'invalid credentials' });
  return res.json({ token: mkToken(username) });
});

app.get('/api/me', auth, (req, res) => {
  res.json({ user: req.user.username, role: req.user.role, flag: 'FLAG{cache_footprint}' });
});

app.get('/api/doc/:id', auth, (req, res) => {
  const id = req.params.id;
  const cacheKey = req.headers['x-cache-key'] ? String(req.headers['x-cache-key']) : `doc:${id}`;

  // Vulnerability #1: cache hit bypasses authorization checks.
  if (cache.has(cacheKey)) {
    return res.json({ fromCache: true, ...cache.get(cacheKey) });
  }

  const doc = docs[id];
  if (!doc) return res.status(404).json({ error: 'not found' });
  if (req.user.role !== 'admin' && doc.owner !== req.user.username) {
    return res.status(403).json({ error: 'forbidden' });
  }

  const body = { doc: id, owner: doc.owner, text: doc.text };
  cache.set(cacheKey, body);
  return res.json({ fromCache: false, ...body });
});

app.post('/api/bot/prime', auth, async (req, res) => {
  const { target, cacheKey } = req.body || {};
  if (!target || !cacheKey) return res.status(400).json({ error: 'target and cacheKey required' });

  // Vulnerability #2: arbitrary internal fetch + attacker-controlled cache key.
  if (!String(target).startsWith('/')) {
    return res.status(400).json({ error: 'target must be internal path' });
  }

  const upstream = await fetch(`${INTERNAL}${target}`, {
    headers: {
      'x-service-auth': 'cerberus-edge',
      'x-as-user': 'admin'
    }
  });

  const data = await upstream.json();
  const trusted = upstream.headers.get('x-trusted-object') === '1';

  cache.set(String(cacheKey), {
    primed: true,
    trusted,
    data
  });

  return res.json({ primed: true, cacheKey, trusted, note: 'cache object stored' });
});

app.get('/api/root', auth, (req, res) => {
  const authKey = `auth:${req.user.username}`;
  const entry = cache.get(authKey);

  // Vulnerability #3: trusts cached auth context without integrity checks.
  if (entry && entry.trusted && entry.data && entry.data.root_token === 'CERB-ROOT-KEY') {
    return res.json({ flag: 'FLAG{cerberus_root}', stage3: entry.data.flag, source: 'cache-trust-bypass' });
  }

  return res.status(403).json({ error: 'root access denied' });
});

app.listen(PORT, () => {
  console.log(`cerberus app listening on ${PORT}`);
});

const crypto = require('crypto');
const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.APP_PORT || 7600;
const INTERNAL = process.env.INTERNAL_API_URL || 'http://internal-api:9200';
const TICKET_SECRET = 'cerberus-ticket-secret';

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

function signTicket(data) {
  return crypto.createHmac('sha256', TICKET_SECRET).update(data).digest('hex').slice(0, 12);
}

app.get('/', (_req, res) => {
  res.json({ name: 'Cerberus Cache', status: 'ok' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users[username];
  if (!user || user.password !== password) return res.status(401).json({ error: 'invalid credentials' });
  return res.json({ token: mkToken(username) });
});

app.get('/api/me', auth, (req, res) => {
  res.json({ user: req.user.username, role: req.user.role, marker: 'FLAG{cache_footprint}' });
});

app.get('/api/doc/:id', auth, (req, res) => {
  const id = req.params.id;
  const bucket = String(req.headers['x-cache-bucket'] || 'default').toLowerCase();
  const cacheKey = `${bucket}:doc:${id}`;

  if (cache.has(cacheKey)) {
    return res.json({ fromCache: true, ...cache.get(cacheKey) });
  }

  const doc = docs[id];
  if (!doc) return res.status(404).json({ error: 'not found' });
  if (req.user.role !== 'admin' && doc.owner !== req.user.username) return res.status(403).json({ error: 'forbidden' });

  const body = { doc: id, owner: doc.owner, text: doc.text };
  cache.set(cacheKey, body);
  return res.json({ fromCache: false, ...body });
});

app.post('/api/bot/ticket', auth, (req, res) => {
  const target = String((req.body || {}).target || '');
  const bucket = String((req.body || {}).bucket || '');
  if (!target.startsWith('/internal/')) return res.status(400).json({ error: 'target rejected' });
  if (!bucket) return res.status(400).json({ error: 'bucket required' });

  const exp = Math.floor(Date.now() / 1000) + 180;
  const payload = `${req.user.username}|${target}|${bucket}|${exp}`;
  const sig = signTicket(payload);
  const ticket = Buffer.from(`${payload}|${sig}`).toString('base64url');

  res.json({ ticket });
});

app.post('/api/bot/prime', auth, async (req, res) => {
  const ticket = String((req.body || {}).ticket || '');
  if (!ticket) return res.status(400).json({ error: 'ticket required' });

  let raw;
  try {
    raw = Buffer.from(ticket, 'base64url').toString('utf8');
  } catch {
    return res.status(400).json({ error: 'bad ticket' });
  }

  const [owner, target, bucket, expStr, sig] = raw.split('|');
  const expected = signTicket(`${owner}|${target}|${bucket}|${expStr}`);
  const now = Math.floor(Date.now() / 1000);

  if (owner !== req.user.username) return res.status(403).json({ error: 'ticket owner mismatch' });
  if (sig !== expected) return res.status(403).json({ error: 'bad ticket signature' });
  if (Number(expStr) < now) return res.status(403).json({ error: 'ticket expired' });

  const upstream = await fetch(`${INTERNAL}${target}`, {
    headers: {
      'x-service-auth': 'cerberus-edge',
      'x-as-user': 'admin'
    }
  });

  const data = await upstream.json();
  const trusted = upstream.headers.get('x-trusted-object') === '1';

  // Vulnerability: attacker controls cache namespace indirectly via ticket bucket.
  cache.set(`${bucket}:doc:admin-secrets`, { fromBot: true, trusted, ...data });
  cache.set(`${bucket}:auth:${req.user.username}`, { fromBot: true, trusted, data });

  return res.json({ primed: true, bucket, trusted });
});

app.get('/api/root', auth, (req, res) => {
  const bucket = String(req.headers['x-cache-bucket'] || 'default').toLowerCase();
  const key = `${bucket}:auth:${req.user.username}`;
  const entry = cache.get(key);

  if (entry && entry.trusted && entry.data && entry.data.root_token === 'CERB-ROOT-KEY') {
    return res.json({ flag: 'FLAG{cerberus_root}', stage3: entry.data.flag, source: 'cache-trust-bypass' });
  }

  return res.status(403).json({ error: 'root access denied' });
});

app.listen(PORT, () => {
  console.log(`cerberus app listening on ${PORT}`);
});

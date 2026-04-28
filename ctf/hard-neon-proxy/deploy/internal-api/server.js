const express = require('express');

const app = express();
app.use(express.json());

const PORT = process.env.API_PORT || 9100;
const OPS_KEY = 'NEON-OPS-KEY-7781';

const flags = {
  stage2: 'FLAG{header_smuggle}',
  stage3: 'FLAG{trust_boundary_break}',
  final: 'FLAG{neon_root}'
};

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/admin/hint', (req, res) => {
  if (req.headers['x-auth-debug'] !== 'elevated-user') {
    return res.status(403).json({ error: 'approval workflow missing' });
  }
  res.json({
    marker: flags.stage2,
    tip: 'Trusted host assertions are consumed by internal pivot endpoint.'
  });
});

app.get('/admin/pivot', (req, res) => {
  const role = req.headers['x-auth-role'];
  const fhost = req.headers['x-forwarded-host'];
  const dbg = req.headers['x-auth-debug'];

  if ((role === 'admin' || fhost === 'ops.neon.local') && dbg === 'elevated-user') {
    return res.json({
      marker: flags.stage3,
      ops_key: OPS_KEY,
      next: 'Use ops key against /root-vault and satisfy admin identity checks.'
    });
  }

  return res.status(403).json({ error: 'forbidden' });
});

app.get('/admin/root-vault', (req, res) => {
  const role = req.headers['x-auth-role'];
  const user = req.headers['x-auth-user'];
  const key = req.headers['x-ops-key'];
  const dbg = req.headers['x-auth-debug'];

  if (role !== 'admin' && user !== 'admin') return res.status(403).json({ error: 'admin identity required' });
  if (key !== OPS_KEY) return res.status(403).json({ error: 'bad ops key' });
  if (dbg !== 'elevated-user') return res.status(403).json({ error: 'elevated approval missing' });

  return res.json({ flag: flags.final, status: 'owned' });
});

app.listen(PORT, () => {
  console.log(`neon internal listening on ${PORT}`);
});

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
  // Stage 2: attacker reaches here via spoofed X-Forwarded-For at edge proxy.
  res.json({
    flag: flags.stage2,
    message: 'Internal endpoint reachable. Continue pivoting trusted headers.'
  });
});

app.get('/admin/pivot', (req, res) => {
  const role = req.headers['x-auth-role'];
  const fhost = req.headers['x-forwarded-host'];

  // Vulnerable condition: treats forwarded host as proof of trusted origin.
  if (role === 'admin' || fhost === 'ops.neon.local') {
    return res.json({
      flag: flags.stage3,
      ops_key: OPS_KEY,
      next: 'Use ops key against /root-vault on edge app.'
    });
  }

  return res.status(403).json({ error: 'forbidden' });
});

app.get('/admin/root-vault', (req, res) => {
  const role = req.headers['x-auth-role'];
  const user = req.headers['x-auth-user'];
  const key = req.headers['x-ops-key'];

  if (role !== 'admin' && user !== 'admin') {
    return res.status(403).json({ error: 'admin identity required' });
  }
  if (key !== OPS_KEY) {
    return res.status(403).json({ error: 'bad ops key' });
  }

  return res.json({ flag: flags.final, status: 'owned' });
});

app.listen(PORT, () => {
  console.log(`neon internal listening on ${PORT}`);
});

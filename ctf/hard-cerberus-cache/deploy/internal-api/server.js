const express = require('express');

const app = express();
const PORT = process.env.API_PORT || 9200;

app.get('/health', (_req, res) => res.json({ ok: true }));

app.get('/internal/bootstrap', (req, res) => {
  if (req.headers['x-service-auth'] !== 'cerberus-edge') {
    return res.status(403).json({ error: 'service auth required' });
  }

  res.set('x-trusted-object', '1');
  return res.json({
    flag: 'FLAG{poisoned_object}',
    root_token: 'CERB-ROOT-KEY',
    role: 'admin-cache-context'
  });
});

app.listen(PORT, () => {
  console.log(`cerberus internal listening on ${PORT}`);
});

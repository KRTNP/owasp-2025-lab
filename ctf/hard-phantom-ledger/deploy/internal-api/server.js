const express = require('express');
const app = express();
const port = process.env.API_PORT || 9000;

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'internal-api' });
});

app.listen(port, () => {
  console.log(`internal api listening on ${port}`);
});

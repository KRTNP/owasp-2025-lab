const express = require('express');
const app = express();
const port = process.env.APP_PORT || 7400;

app.get('/', (_req, res) => {
  res.send('Phantom Ledger challenge app placeholder. Build vulnerable routes here.');
});

app.listen(port, () => {
  console.log(`app listening on ${port}`);
});

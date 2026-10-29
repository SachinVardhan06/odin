const app = require('./app');

// Hosts such as Render assign the port and require binding to 0.0.0.0.
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`order-api listening on http://${HOST}:${PORT}`);
});

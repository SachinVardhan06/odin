const app = require('./app');

// A platform that assigns PORT also needs the server on every interface, so bind 0.0.0.0
// there. With no PORT set we are running locally, so stay on loopback and keep this
// deliberately vulnerable app off the local network.
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || (process.env.PORT ? '0.0.0.0' : '127.0.0.1');

app.listen(PORT, HOST, () => {
  console.log(`order-api listening on http://${HOST}:${PORT}`);
});

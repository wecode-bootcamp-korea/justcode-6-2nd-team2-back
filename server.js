require('dotenv').config();
const http = require('http');

const { createApp } = require('./app');

const app = createApp();

const server = http.createServer(app);
const PORT = process.env.PORT || 10010;
server.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});

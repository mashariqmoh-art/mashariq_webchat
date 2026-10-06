require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./db/db');
const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;

    this.registerMiddleware();
    this.registerRoutes();
  }

  registerMiddleware() {
    this.app.use(cors({ origin: 'http://localhost:5174', credentials: true }));
    this.app.use(express.json());
  }

  registerRoutes() {
    this.app.get('/api/health', (req, res) => {
      res.json({ ok: true });
    });

    this.app.use('/api/auth', authRoutes);

    this.app.get('/api/me', auth.authenticate, (req, res) => {
      res.json({ user: req.user });
    });
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Mashariq WebChat server running on http://localhost:${this.port}`);
    });
  }
}

const server = new Server();
server.start();

module.exports = server.app;

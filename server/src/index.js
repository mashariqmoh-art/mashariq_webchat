require('dotenv').config();

const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server: SocketServer } = require('socket.io');
const authRoutes = require('./routes/auth');
const conversationsRoutes = require('./routes/conversations');
const messagesRoutes = require('./routes/messages');
const auth = require('./middleware/auth');
const registerChatSocket = require('./sockets/chat');

class AppServer {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.server = http.createServer(this.app);
    this.io = new SocketServer(this.server, {
      cors: {
        origin: 'http://localhost:5174',
        credentials: true,
      },
    });

    this.registerMiddleware();
    this.registerRoutes();
    registerChatSocket(this.io);
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
    this.app.use('/api/conversations', conversationsRoutes);
    this.app.use('/api/conversations', messagesRoutes);

    this.app.get('/api/me', auth.authenticate, (req, res) => {
      res.json({ user: req.user });
    });
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Mashariq WebChat server running on http://localhost:${this.port}`);
    });
  }
}

const server = new AppServer();
server.start();

module.exports = server.app;

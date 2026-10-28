require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const { Server: SocketIOServer } = require('socket.io');
const db = require('./db/db');
const authRoutes = require('./routes/auth');
const conversationRoutes = require('./routes/conversations');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');
const profileRoutes = require('./routes/profile');
const auth = require('./middleware/auth');
const ChatSockets = require('./sockets/chat');
const uploadDirectory = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3001;
    this.httpServer = http.createServer(this.app);
    this.io = new SocketIOServer(this.httpServer, {
      cors: {
        origin: /^https?:\/\/localhost(:\d+)?$/,
        credentials: true,
      },
    });

    this.registerMiddleware();
    this.registerRoutes();
    this.chatSockets = new ChatSockets(this.io);
  }

  registerMiddleware() {
    this.app.use(cors({
      origin: /^https?:\/\/localhost(:\d+)?$/,
      credentials: true
    }));
  }

  registerRoutes() {
    this.app.use('/uploads', express.static(uploadDirectory, { dotfiles: 'deny', index: false }));
    this.app.use('/api/profile', express.json({ limit: '3mb' }), profileRoutes);
    this.app.use(express.json());

    this.app.get('/api/health', (req, res) => {
      res.json({ ok: true });
    });

    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/conversations', messageRoutes);
    this.app.use('/api/conversations', conversationRoutes);
    this.app.use('/api/groups', conversationRoutes.groupRouter);
    this.app.use('/api/admin', adminRoutes);

    this.app.get('/api/me', auth.authenticate, (req, res) => {
      res.json({ user: req.user });
    });
  }

  start() {
    this.httpServer.listen(this.port, () => {
      console.log(`Mashariq WebChat server running on http://localhost:${this.port}`);
    });
  }
}

const server = new Server();
server.start();

module.exports = server.app;

const jwt = require('jsonwebtoken');
const conversations = require('../db/conversations');
const messages = require('../db/messages');
const users = require('../db/user');

class ChatSockets {
  constructor(io) {
    this.io = io;
    this.jwtSecret = process.env.JWT_SECRET;

    this.io.use(this.authenticate.bind(this));
    this.io.on('connection', this.onConnection.bind(this));
  }

  authenticate(socket, next) {
    const token = socket.handshake.auth && socket.handshake.auth.token;

    try {
      socket.user = jwt.verify(token, this.jwtSecret);
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  }

  roomName(conversationSID) {
    return `conv_${conversationSID}`;
  }

  onConnection(socket) {
    socket.on('join', (payload, ack) => this.onJoin(socket, payload, ack));
    socket.on('message', (payload, ack) => this.onMessage(socket, payload, ack));
    socket.on('typing', (payload) => this.onTyping(socket, payload));
  }

  onJoin(socket, payload, ack) {
    const conversationSID = Number(payload && payload.conversationSID);

    if (!conversations.isMember(conversationSID, socket.user.userSID)) {
      if (ack) ack({ error: 'You are not a member of this conversation' });
      return;
    }

    for (const room of socket.rooms) {
      if (room !== socket.id) socket.leave(room);
    }
    socket.join(this.roomName(conversationSID));
    if (ack) ack({ ok: true });
  }

  onMessage(socket, payload, ack) {
    const conversationSID = Number(payload && payload.conversationSID);
    const content = ((payload && payload.content) || '').trim();

    if (!content) {
      if (ack) ack({ error: 'content is required' });
      return;
    }

    if (!conversations.isMember(conversationSID, socket.user.userSID)) {
      if (ack) ack({ error: 'You are not a member of this conversation' });
      return;
    }

    const message = messages.createMessage({
      conversationSID,
      senderSID: socket.user.userSID,
      content,
    });
    if (payload.clientTag) message.clientTag = payload.clientTag;

    this.io.to(this.roomName(conversationSID)).emit('message', message);
    if (ack) ack({ ok: true, message });
  }

  onTyping(socket, payload) {
    const conversationSID = Number(payload && payload.conversationSID);

    if (!conversations.isMember(conversationSID, socket.user.userSID)) return;

    const profile = users.getProfileBySID(socket.user.userSID);
    socket.to(this.roomName(conversationSID)).emit('typing', {
      conversationSID,
      userSID: socket.user.userSID,
      nickName: profile ? profile.nickName : socket.user.nickName,
    });
  }
}

module.exports = ChatSockets;

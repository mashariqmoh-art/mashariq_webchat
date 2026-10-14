const jwt = require('jsonwebtoken');
const conversations = require('../db/conversations');
const messages = require('../db/messages');

const jwtSecret = process.env.JWT_SECRET || 'mashariq-dev-secret';

module.exports = function registerChatSocket(io) {
  io.use((socket, next) => {
    const rawToken = socket.handshake.auth?.token || socket.handshake.headers?.authorization || '';
    const token = rawToken.startsWith('Bearer ') ? rawToken.replace('Bearer ', '') : rawToken;

    if (!token) {
      return next(new Error('Missing auth token'));
    }

    try {
      socket.user = jwt.verify(token, jwtSecret);
      return next();
    } catch (error) {
      return next(new Error('Unauthorized'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('join', (conversationSID) => {
      const conversationId = Number(conversationSID);
      const conversation = conversations.getConversationBySID(conversationId);

      if (!conversation) {
        socket.emit('error', 'Conversation not found');
        return;
      }

      const isMember = conversation.members.some((member) => Number(member.user_SID) === Number(socket.user.userSID));
      if (!isMember) {
        socket.emit('error', 'You do not belong to this conversation');
        return;
      }

      const roomName = `conv_${conversationId}`;
      socket.join(roomName);
      socket.data.conversationSID = conversationId;
    });

    socket.on('message', (payload) => {
      const rawConversationSID = payload?.conversationSID ?? payload?.conversation_SID ?? payload?.conversationId;
      const rawContent = payload?.content ?? payload?.message ?? '';
      const conversationSID = Number(rawConversationSID);
      const content = String(rawContent || '').trim();

      if (!conversationSID || !content) {
        socket.emit('error', 'Conversation and content are required');
        return;
      }

      const conversation = conversations.getConversationBySID(conversationSID);
      if (!conversation) {
        socket.emit('error', 'Conversation not found');
        return;
      }

      const isMember = conversation.members.some((member) => Number(member.user_SID) === Number(socket.user.userSID));
      if (!isMember) {
        socket.emit('error', 'You do not belong to this conversation');
        return;
      }

      try {
        const createdMessage = messages.createMessage({
          conversationSID,
          senderSID: socket.user.userSID,
          content,
        });

        io.to(`conv_${conversationSID}`).emit('message', createdMessage);
      } catch (error) {
        socket.emit('error', error.message || 'Unable to save message');
      }
    });

    socket.on('typing', (conversationSID) => {
      const roomName = `conv_${Number(conversationSID)}`;
      socket.to(roomName).emit('typing', {
        userSID: socket.user.userSID,
        nickName: socket.user.nickName || socket.user.name || 'User',
        conversationSID: Number(conversationSID),
      });
    });
  });
};

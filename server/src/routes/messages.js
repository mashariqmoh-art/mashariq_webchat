const express = require('express');
const auth = require('../middleware/auth');
const conversations = require('../db/conversations');
const messages = require('../db/messages');

class MessagesRoutes {
  constructor() {
    this.router = express.Router();

    this.router.use(auth.authenticate);
    this.router.get('/:sid/messages', this.list.bind(this));
    this.router.post('/:sid/messages', this.create.bind(this));
  }

  list(req, res) {
    const conversationSID = Number(req.params.sid);
    const conversation = conversations.getConversationBySID(conversationSID);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const isMember = conversation.members.some((member) => Number(member.user_SID) === Number(req.user.userSID));
    if (!isMember) {
      return res.status(403).json({ error: 'You do not belong to this conversation' });
    }

    return res.json({ messages: messages.getMessagesForConversation(conversationSID) });
  }

  create(req, res) {
    const conversationSID = Number(req.params.sid);
    const rawContent = req.body?.content ?? req.body?.message ?? '';
    const content = String(rawContent || '').trim();
    const userSID = Number(req.user.userSID);

    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const conversation = conversations.getConversationBySID(conversationSID);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const isMember = conversation.members.some((member) => Number(member.user_SID) === userSID);
    if (!isMember) {
      return res.status(403).json({ error: 'You do not belong to this conversation' });
    }

    try {
      const message = messages.createMessage({
        conversationSID,
        senderSID: userSID,
        content,
      });

      return res.status(201).json({ message });
    } catch (error) {
      return res.status(500).json({ error: error.message || 'Unable to save message' });
    }
  }
}

module.exports = new MessagesRoutes().router;

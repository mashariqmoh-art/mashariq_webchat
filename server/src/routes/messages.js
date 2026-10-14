const express = require('express');
const auth = require('../middleware/auth');
const conversations = require('../db/conversations');
const messages = require('../db/messages');

class MessageRoutes {
  constructor() {
    this.router = express.Router();
    this.router.use(auth.authenticate);

    this.router.get('/:sid/messages', this.list.bind(this));
    this.router.post('/:sid/messages', this.create.bind(this));
  }

  checkMembership(req, res) {
    const sid = Number(req.params.sid);
    const conversation = conversations.getConversationBySID(sid);

    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found' });
      return null;
    }

    if (!conversations.isMember(sid, req.user.userSID)) {
      res.status(403).json({ error: 'You are not a member of this conversation' });
      return null;
    }

    return sid;
  }

  list(req, res) {
    const sid = this.checkMembership(req, res);
    if (sid === null) return;

    res.json({ messages: messages.getMessagesForConversation(sid) });
  }

  create(req, res) {
    const sid = this.checkMembership(req, res);
    if (sid === null) return;

    const { content } = req.body || {};
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content is required' });
    }

    const message = messages.createMessage({
      conversationSID: sid,
      senderSID: req.user.userSID,
      content: content.trim(),
    });
    res.status(201).json({ message });
  }
}

module.exports = new MessageRoutes().router;

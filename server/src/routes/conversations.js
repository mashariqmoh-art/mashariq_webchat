const express = require('express');
const auth = require('../middleware/auth');
const conversations = require('../db/conversations');
const users = require('../db/user');

class ConversationRoutes {
  constructor() {
    this.router = express.Router();
    this.router.use(auth.authenticate);

    this.router.get('/', this.list.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.get('/:sid', this.getOne.bind(this));
  }

  list(req, res) {
    res.json({ conversations: conversations.getConversationsForUser(req.user.userSID) });
  }

  create(req, res) {
    const { otherUserSID } = req.body || {};

    if (!otherUserSID) {
      return res.status(400).json({ error: 'otherUserSID is required' });
    }

    if (Number(otherUserSID) === req.user.userSID) {
      return res.status(400).json({ error: 'Cannot start a conversation with yourself' });
    }

    if (!users.findUserBySID(otherUserSID)) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existing = conversations.findDirectConversation(req.user.userSID, otherUserSID);
    if (existing) {
      return res.json({ conversationSID: existing.SID, existing: true });
    }

    const conversation = conversations.createConversation({
      creatorSID: req.user.userSID,
      otherUserSID: Number(otherUserSID),
    });
    res.status(201).json({ conversationSID: conversation.SID });
  }

  getOne(req, res) {
    const sid = Number(req.params.sid);
    const conversation = conversations.getConversationBySID(sid);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    if (!conversations.isMember(sid, req.user.userSID)) {
      return res.status(403).json({ error: 'You are not a member of this conversation' });
    }

    res.json({ conversation });
  }
}

module.exports = new ConversationRoutes().router;

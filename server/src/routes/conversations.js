const express = require('express');
const auth = require('../middleware/auth');
const conversations = require('../db/conversations');

class ConversationsRoutes {
  constructor() {
    this.router = express.Router();

    this.router.use(auth.authenticate);
    this.router.get('/', this.list.bind(this));
    this.router.post('/', this.create.bind(this));
    this.router.get('/:sid', this.getBySID.bind(this));
  }

  list(req, res) {
    const userSID = req.user.userSID;
    const allConversations = conversations.getConversationsForUser(userSID);
    res.json({ conversations: allConversations });
  }

  create(req, res) {
    const { otherUserSID } = req.body || {};
    const userSID = req.user.userSID;

    if (!otherUserSID) {
      return res.status(400).json({ error: 'otherUserSID is required' });
    }

    try {
      const conversation = conversations.createConversation({
        creatorSID: userSID,
        otherUserSID: Number(otherUserSID),
      });

      return res.status(201).json({ conversation });
    } catch (error) {
      if (error.message.includes('cannot start a conversation with yourself')) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Unable to create conversation' });
    }
  }

  getBySID(req, res) {
    const conversationSID = Number(req.params.sid);
    const conversation = conversations.getConversationBySID(conversationSID);

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const isMember = conversation.members.some((member) => member.user_SID === req.user.userSID);
    if (!isMember) {
      return res.status(403).json({ error: 'You do not belong to this conversation' });
    }

    return res.json({ conversation });
  }
}

module.exports = new ConversationsRoutes().router;

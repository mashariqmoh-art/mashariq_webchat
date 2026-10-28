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
    this.router.get('/users', this.listUsers.bind(this));
    this.router.get('/:sid', this.getOne.bind(this));

    this.groupRouter = express.Router();
    this.groupRouter.use(auth.authenticate);
    this.groupRouter.post('/', this.createGroup.bind(this));
  }

  list(req, res) {
    res.json({ conversations: conversations.getConversationsForUser(req.user.userSID) });
  }

  listUsers(req, res) {
    res.json({ users: users.findAvailableUsers(req.user.userSID) });
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

  createGroup(req, res) {
    const { name, memberSIDs } = req.body || {};

    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'name is required' });
    }

    if (!Array.isArray(memberSIDs) || memberSIDs.some((sid) => {
      const hasValidType = Number.isSafeInteger(sid)
        || (typeof sid === 'string' && /^\d+$/.test(sid));
      return !hasValidType || !Number.isSafeInteger(Number(sid)) || Number(sid) <= 0;
    })) {
      return res.status(400).json({ error: 'memberSIDs must be an array of valid user SIDs' });
    }

    const memberIDs = [...new Set(memberSIDs.map(Number))]
      .filter((sid) => sid !== req.user.userSID);

    if (memberIDs.length === 0) {
      return res.status(400).json({ error: 'At least one other member is required' });
    }

    if (memberIDs.some((sid) => !users.findUserBySID(sid))) {
      return res.status(404).json({ error: 'One or more users were not found' });
    }

    const conversation = conversations.createGroup({
      creatorSID: req.user.userSID,
      name: name.trim(),
      memberSIDs: memberIDs,
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

const conversationRoutes = new ConversationRoutes();
module.exports = conversationRoutes.router;
module.exports.groupRouter = conversationRoutes.groupRouter;

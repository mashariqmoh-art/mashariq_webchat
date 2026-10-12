const db = require('./db');

class ConversationRepository {
  createConversation({ creatorSID, otherUserSID }) {
    if (!creatorSID || !otherUserSID) {
      throw new Error('creatorSID and otherUserSID are required');
    }

    if (Number(creatorSID) === Number(otherUserSID)) {
      throw new Error('You cannot start a conversation with yourself');
    }

    const existing = this.getExistingDirectConversation(creatorSID, otherUserSID);
    if (existing) {
      return this.getConversationBySID(existing.SID);
    }

    const result = db.prepare(`
      INSERT INTO table_Conversation (name, isGroup, createdBy_SID)
      VALUES (NULL, 0, ?)
    `).run(creatorSID);

    const conversationSID = result.lastInsertRowid;

    db.prepare(`
      INSERT INTO table_ConversationMember (conversation_SID, user_SID, isGroupAdmin)
      VALUES (?, ?, 0)
    `).run(conversationSID, creatorSID);

    db.prepare(`
      INSERT INTO table_ConversationMember (conversation_SID, user_SID, isGroupAdmin)
      VALUES (?, ?, 0)
    `).run(conversationSID, otherUserSID);

    return this.getConversationBySID(conversationSID);
  }

  getExistingDirectConversation(userSIDA, userSIDB) {
    return db.prepare(`
      SELECT c.SID
      FROM table_Conversation c
      WHERE c.isGroup = 0
        AND EXISTS (
          SELECT 1 FROM table_ConversationMember cm1
          WHERE cm1.conversation_SID = c.SID AND cm1.user_SID = ?
        )
        AND EXISTS (
          SELECT 1 FROM table_ConversationMember cm2
          WHERE cm2.conversation_SID = c.SID AND cm2.user_SID = ?
        )
      LIMIT 1
    `).get(userSIDA, userSIDB);
  }

  getConversationMembers(conversationSID) {
    return db.prepare(`
      SELECT cm.SID, cm.conversation_SID, cm.user_SID, cm.isGroupAdmin, cm.joinedAt,
             u.name, u.nickName, u.email, u.mobileNo
      FROM table_ConversationMember cm
      JOIN table_User u ON u.SID = cm.user_SID
      WHERE cm.conversation_SID = ?
      ORDER BY cm.joinedAt ASC
    `).all(conversationSID);
  }

  getConversationsForUser(userSID) {
    const conversations = db.prepare(`
      SELECT c.*
      FROM table_ConversationMember cm
      JOIN table_Conversation c ON c.SID = cm.conversation_SID
      WHERE cm.user_SID = ?
      ORDER BY c.createdAt DESC
    `).all(userSID);

    return conversations.map((conversation) => ({
      ...conversation,
      members: this.getConversationMembers(conversation.SID),
    }));
  }

  getConversationBySID(sid) {
    const conversation = db.prepare(`
      SELECT *
      FROM table_Conversation
      WHERE SID = ?
    `).get(sid);

    if (!conversation) {
      return null;
    }

    return {
      ...conversation,
      members: this.getConversationMembers(conversation.SID),
    };
  }
}

module.exports = new ConversationRepository();

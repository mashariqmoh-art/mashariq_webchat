const db = require('./db');

class ConversationRepository {
  createConversation({ creatorSID, otherUserSID }) {
    const insertConversation = db.prepare(`
      INSERT INTO table_Conversation (name, isGroup, createdBy_SID)
      VALUES (NULL, 0, ?)
    `);

    const createTx = db.transaction(() => {
      const result = insertConversation.run(creatorSID);
      const conversationSID = result.lastInsertRowid;
      this.addMember(conversationSID, creatorSID);
      this.addMember(conversationSID, otherUserSID);
      return conversationSID;
    });

    return this.getConversationBySID(createTx());
  }

  createGroup({ creatorSID, name, memberSIDs = [] }) {
    const createTx = db.transaction(() => {
      const result = db.prepare(`
        INSERT INTO table_Conversation (name, isGroup, createdBy_SID)
        VALUES (?, 1, ?)
      `).run(name, creatorSID);
      const conversationSID = result.lastInsertRowid;

      this.addMember(conversationSID, creatorSID, 1);
      for (const userSID of memberSIDs) {
        const memberSID = Number(userSID);
        if (memberSID !== creatorSID) {
          this.addMember(conversationSID, memberSID);
        }
      }
      return conversationSID;
    });

    return this.getConversationBySID(createTx());
  }

  addMember(conversationSID, userSID, isGroupAdmin = 0) {
    return db.prepare(`
      INSERT INTO table_ConversationMember (conversation_SID, user_SID, isGroupAdmin)
      VALUES (?, ?, ?)
    `).run(conversationSID, userSID, isGroupAdmin).lastInsertRowid;
  }

  addMemberToConversation({ conversationSID, userSID }) {
    return this.addMember(conversationSID, userSID);
  }

  getConversationsForUser(userSID) {
    return db.prepare(`
      SELECT c.SID, c.name, c.isGroup, c.createdBy_SID, c.createdAt,
             u.SID AS otherUserSID, u.name AS otherUserName, u.nickName AS otherUserNickName
      FROM table_Conversation c
      JOIN table_ConversationMember cm
        ON cm.conversation_SID = c.SID AND cm.user_SID = ?
      LEFT JOIN table_ConversationMember ocm
        ON ocm.conversation_SID = c.SID AND ocm.user_SID != ? AND c.isGroup = 0
      LEFT JOIN table_User u ON u.SID = ocm.user_SID
      ORDER BY c.SID DESC
    `).all(userSID, userSID);
  }

  getConversationBySID(sid) {
    const conversation = db.prepare('SELECT * FROM table_Conversation WHERE SID = ?').get(sid);
    if (!conversation) return null;

    conversation.members = db.prepare(`
      SELECT cm.user_SID, cm.isGroupAdmin, cm.joinedAt, u.name, u.nickName
      FROM table_ConversationMember cm
      JOIN table_User u ON u.SID = cm.user_SID
      WHERE cm.conversation_SID = ?
    `).all(sid);

    return conversation;
  }

  findDirectConversation(userSID, otherUserSID) {
    return db.prepare(`
      SELECT c.*
      FROM table_Conversation c
      JOIN table_ConversationMember a
        ON a.conversation_SID = c.SID AND a.user_SID = ?
      JOIN table_ConversationMember b
        ON b.conversation_SID = c.SID AND b.user_SID = ?
      WHERE c.isGroup = 0
    `).get(userSID, otherUserSID);
  }

  isMember(conversationSID, userSID) {
    return !!db.prepare(`
      SELECT 1 FROM table_ConversationMember
      WHERE conversation_SID = ? AND user_SID = ?
    `).get(conversationSID, userSID);
  }
}

module.exports = new ConversationRepository();

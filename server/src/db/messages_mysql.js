const db = require('./db');

class MessageRepository {
  createMessage({ conversationSID, senderSID, content }) {
    const result = db.prepare(`
      INSERT INTO table_Message (conversation_SID, sender_SID, content)
      VALUES (?, ?, ?)
    `).run(conversationSID, senderSID, content);

    return this.getMessageBySID(result.lastInsertRowid);
  }

  getMessageBySID(sid) {
    return db.prepare(`
      SELECT m.*, u.name AS senderName, u.nickName AS senderNickName,
             u.profilePicturePath AS senderProfilePicturePath
      FROM table_Message m
      JOIN table_User u ON u.SID = m.sender_SID
      WHERE m.SID = ?
    `).get(sid);
  }

  getMessagesForConversation(conversationSID) {
    return db.prepare(`
      SELECT m.*, u.name AS senderName, u.nickName AS senderNickName,
             u.profilePicturePath AS senderProfilePicturePath
      FROM table_Message m
      JOIN table_User u ON u.SID = m.sender_SID
      WHERE m.conversation_SID = ?
      ORDER BY m.createdAt ASC, m.SID ASC
    `).all(conversationSID);
  }
}

module.exports = new MessageRepository();

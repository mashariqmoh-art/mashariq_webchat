const db = require('./db');

class MessageRepository {
  createMessage({ conversationSID, senderSID, content, messageTypeSID = 0 }) {
    const trimmedContent = String(content || '').trim();

    if (!conversationSID || !senderSID || !trimmedContent) {
      throw new Error('conversationSID, senderSID, and content are required');
    }

    const result = db.prepare(`
      INSERT INTO table_Message (conversation_SID, sender_SID, content, messageType_SID)
      VALUES (?, ?, ?, ?)
    `).run(Number(conversationSID), Number(senderSID), trimmedContent, Number(messageTypeSID || 0));

    return this.getMessageBySID(result.lastInsertRowid);
  }

  getMessageBySID(messageSID) {
    return db.prepare(`
      SELECT m.*, u.nickName AS senderNickName, u.name AS senderName
      FROM table_Message m
      JOIN table_User u ON u.SID = m.sender_SID
      WHERE m.SID = ?
    `).get(messageSID);
  }

  getMessagesForConversation(conversationSID) {
    return db.prepare(`
      SELECT m.*, u.nickName AS senderNickName, u.name AS senderName
      FROM table_Message m
      JOIN table_User u ON u.SID = m.sender_SID
      WHERE m.conversation_SID = ?
      ORDER BY m.createdAt ASC
    `).all(Number(conversationSID));
  }
}

module.exports = new MessageRepository();

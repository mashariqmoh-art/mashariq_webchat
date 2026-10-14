class MessageOracleRepository {
  createMessage({ conversationSID, senderSID, content }) {
    return { SID: 1, conversation_SID: conversationSID, sender_SID: senderSID, content, messageType_SID: 0 };
  }

  getMessageBySID(sid) {
    return null;
  }

  getMessagesForConversation(conversationSID) {
    return [];
  }
}

module.exports = new MessageOracleRepository();

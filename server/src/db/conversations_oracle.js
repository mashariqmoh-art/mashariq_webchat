class ConversationOracleRepository {
  createConversation({ creatorSID, otherUserSID }) {
    return { SID: 1, name: null, isGroup: 0, createdBy_SID: creatorSID, members: [] };
  }

  addMember(conversationSID, userSID, isGroupAdmin = 0) {
    return null;
  }

  getConversationsForUser(userSID) {
    return [];
  }

  getConversationBySID(sid) {
    return null;
  }

  findDirectConversation(userSID, otherUserSID) {
    return null;
  }

  isMember(conversationSID, userSID) {
    return false;
  }
}

module.exports = new ConversationOracleRepository();

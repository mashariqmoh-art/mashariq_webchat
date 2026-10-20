class ConversationOracleRepository {
  createConversation({ creatorSID, otherUserSID }) {
    return { SID: 1, name: null, isGroup: 0, createdBy_SID: creatorSID, members: [] };
  }

  createGroup({ creatorSID, name, memberSIDs = [] }) {
    const members = [...new Set([creatorSID, ...memberSIDs])].map((user_SID) => ({
      user_SID,
      isGroupAdmin: user_SID === creatorSID ? 1 : 0,
    }));
    return { SID: 1, name, isGroup: 1, createdBy_SID: creatorSID, members };
  }

  addMember(conversationSID, userSID, isGroupAdmin = 0) {
    return null;
  }

  addMemberToConversation({ conversationSID, userSID }) {
    return this.addMember(conversationSID, userSID);
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

const dbBuilder = require('./db_builder');

class Conversation {
  constructor() {
    this.repo = dbBuilder.buildConversationRepository();
  }

  createConversation(data) {
    return this.repo.createConversation(data);
  }

  createGroup(data) {
    return this.repo.createGroup(data);
  }

  addMember(conversationSID, userSID, isGroupAdmin) {
    return this.repo.addMember(conversationSID, userSID, isGroupAdmin);
  }

  addMemberToConversation(data) {
    return this.repo.addMemberToConversation(data);
  }

  getConversationsForUser(userSID) {
    return this.repo.getConversationsForUser(userSID);
  }

  getConversationBySID(sid) {
    return this.repo.getConversationBySID(sid);
  }

  findDirectConversation(userSID, otherUserSID) {
    return this.repo.findDirectConversation(userSID, otherUserSID);
  }

  isMember(conversationSID, userSID) {
    return this.repo.isMember(conversationSID, userSID);
  }
}

module.exports = new Conversation();

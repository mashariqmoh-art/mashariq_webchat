const dbBuilder = require('./db_builder');

class Message {
  constructor() {
    this.repo = dbBuilder.buildMessageRepository();
  }

  createMessage(data) {
    return this.repo.createMessage(data);
  }

  getMessageBySID(sid) {
    return this.repo.getMessageBySID(sid);
  }

  getMessagesForConversation(conversationSID) {
    return this.repo.getMessagesForConversation(conversationSID);
  }
}

module.exports = new Message();

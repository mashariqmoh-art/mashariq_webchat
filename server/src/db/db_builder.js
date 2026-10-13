const userMysql = require('./users_mysql');
const userOracle = require('./user_oracle');
const conversationMysql = require('./conversations_mysql');
const conversationOracle = require('./conversations_oracle');

class DBBuilder {
  constructor() {
    this.engine = process.env.DB_ENGINE || 'mysql';
  }

  buildUserRepository() {
    switch (this.engine) {
      case 'oracle':
        return userOracle;
      case 'mysql':
      default:
        return userMysql;
    }
  }

  buildConversationRepository() {
    switch (this.engine) {
      case 'oracle':
        return conversationOracle;
      case 'mysql':
      default:
        return conversationMysql;
    }
  }
}

module.exports = new DBBuilder();

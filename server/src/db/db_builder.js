const userMysql = require('./users_mysql');
const userOracle = require('./user_oracle');

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
}

module.exports = new DBBuilder();

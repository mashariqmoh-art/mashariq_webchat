const dbBuilder = require('./db_builder');

class User {
  constructor() {
    this.repo = dbBuilder.buildUserRepository();
  }

  createUser(data) {
    return this.repo.createUser(data);
  }

  findUserByEmail(email) {
    return this.repo.findUserByEmail(email);
  }

  findUserBySID(sid) {
    return this.repo.findUserBySID(sid);
  }
}

module.exports = new User();

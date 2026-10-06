const bcryptjs = require('bcryptjs');
const db = require('./db');

class UserRepository {
  createUser({ name, email, nickName, mobileNo, password }) {
    const passwordHash = bcryptjs.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO table_User (name, email, nickName, mobileNo, password)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, nickName, mobileNo, passwordHash);
    return this.findUserBySID(result.lastInsertRowid);
  }

  findUserByEmail(email) {
    return db.prepare('SELECT * FROM table_User WHERE email = ?').get(email);
  }

  findUserBySID(sid) {
    return db.prepare('SELECT * FROM table_User WHERE SID = ?').get(sid);
  }
}

module.exports = new UserRepository();

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

  findUserByNickName(nickName) {
    return db.prepare('SELECT * FROM table_User WHERE nickName = ?').get(nickName);
  }

  findUserBySID(sid) {
    return db.prepare('SELECT * FROM table_User WHERE SID = ?').get(sid);
  }

  findAvailableUsers(excludeSID) {
    return db.prepare(`
      SELECT SID, name, nickName
      FROM table_User
      WHERE isActive = 1 AND SID != ?
      ORDER BY nickName COLLATE NOCASE
    `).all(excludeSID);
  }
}

module.exports = new UserRepository();

const bcryptjs = require('bcryptjs');
const db = require('./db');

class UserRepository {
  createUser({ name, email, nickName, mobileNo, password, createdBySID = null }) {
    const passwordHash = bcryptjs.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO table_User (name, email, nickName, mobileNo, password, createdBy_SID)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, email, nickName, mobileNo, passwordHash, createdBySID);
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

  getProfileBySID(sid) {
    return db.prepare(`
      SELECT SID, name, email, nickName, mobileNo, profilePicturePath, status, createdAt
      FROM table_User
      WHERE SID = ?
    `).get(sid);
  }

  updateProfile(sid, profile) {
    const fields = Object.keys(profile);
    if (fields.length === 0) return this.getProfileBySID(sid);

    const assignments = fields.map((field) => `${field} = ?`).join(', ');
    db.prepare(`UPDATE table_User SET ${assignments} WHERE SID = ?`)
      .run(...fields.map((field) => profile[field]), sid);
    return this.getProfileBySID(sid);
  }

  updateProfilePicture(sid, profilePicturePath) {
    db.prepare('UPDATE table_User SET profilePicturePath = ? WHERE SID = ?')
      .run(profilePicturePath, sid);
    return this.getProfileBySID(sid);
  }

  listUsers() {
    return db.prepare(`
      SELECT u.SID, u.name, u.email, u.nickName, u.mobileNo, u.isActive, u.createdAt,
             (SELECT GROUP_CONCAT(r.name, ', ')
              FROM table_UserRole ur
              JOIN table_Role r ON r.SID = ur.role_SID AND r.isActive = 1
              WHERE ur.user_SID = u.SID AND ur.isActive = 1) AS roles
      FROM table_User u
      ORDER BY u.SID
    `).all();
  }

  userHasPermission(userSID, permissionName) {
    return !!db.prepare(`
      SELECT 1
      FROM table_UserRole ur
      JOIN table_Role r ON r.SID = ur.role_SID AND r.isActive = 1
      JOIN table_RolePermission rp ON rp.role_SID = ur.role_SID AND rp.isActive = 1
      JOIN table_Permission p ON p.SID = rp.permission_SID
      WHERE ur.user_SID = ? AND ur.isActive = 1 AND p.name = ?
    `).get(userSID, permissionName);
  }

  assignRole(userSID, roleSID) {
    db.prepare(`
      INSERT INTO table_UserRole (user_SID, role_SID)
      VALUES (?, ?)
      ON CONFLICT(user_SID, role_SID) DO UPDATE SET isActive = 1
    `).run(userSID, roleSID);
  }

  listRoles() {
    return db.prepare(`
      SELECT SID, name, isDelegated, isActive
      FROM table_Role
      WHERE isActive = 1
      ORDER BY SID
    `).all();
  }

  findRoleByName(name) {
    return db.prepare('SELECT * FROM table_Role WHERE name = ? AND isActive = 1').get(name);
  }

  findAvailableUsers(excludeSID) {
    return db.prepare(`
      SELECT SID, name, nickName, profilePicturePath
      FROM table_User
      WHERE isActive = 1 AND SID != ?
      ORDER BY nickName COLLATE NOCASE
    `).all(excludeSID);
  }
}

module.exports = new UserRepository();

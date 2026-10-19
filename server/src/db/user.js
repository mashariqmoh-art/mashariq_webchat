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

  findUserByNickName(nickName) {
    return this.repo.findUserByNickName(nickName);
  }

  findUserBySID(sid) {
    return this.repo.findUserBySID(sid);
  }

  listUsers() {
    return this.repo.listUsers();
  }

  userHasPermission(userSID, permissionName) {
    return this.repo.userHasPermission(userSID, permissionName);
  }

  assignRole(userSID, roleSID) {
    return this.repo.assignRole(userSID, roleSID);
  }

  listRoles() {
    return this.repo.listRoles();
  }

  findRoleByName(name) {
    return this.repo.findRoleByName(name);
  }
}

module.exports = new User();

class UserOracleRepository {
  createUser({ name, email, nickName, mobileNo }) {
    return { SID: 1, name, email, nickName, mobileNo, isActive: 1 };
  }

  findUserByEmail(email) {
    return null;
  }

  findUserByNickName(nickName) {
    return null;
  }

  findUserBySID(sid) {
    return null;
  }

  listUsers() {
    return [];
  }

  userHasPermission(userSID, permissionName) {
    return false;
  }

  assignRole(userSID, roleSID) {
    return null;
  }

  listRoles() {
    return [];
  }

  findRoleByName(name) {
    return null;
  }

  findAvailableUsers(excludeSID) {
    return [];
  }
}

module.exports = new UserOracleRepository();

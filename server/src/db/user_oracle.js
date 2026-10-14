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
}

module.exports = new UserOracleRepository();

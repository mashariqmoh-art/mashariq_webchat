const express = require('express');
const auth = require('../middleware/auth');
const permission = require('../middleware/requirePermission');
const users = require('../db/user');

class AdminRoutes {
  constructor() {
    this.router = express.Router();
    this.router.use(auth.authenticate);

    this.router.get('/users', permission.requirePermission('users.read'), this.listUsers.bind(this));
    this.router.post('/users', permission.requirePermission('users.create'), this.createUser.bind(this));
    this.router.get('/roles', permission.requirePermission('users.read'), this.listRoles.bind(this));
  }

  listUsers(req, res) {
    res.json({ users: users.listUsers() });
  }

  listRoles(req, res) {
    res.json({ roles: users.listRoles() });
  }

  createUser(req, res) {
    const { name, email, nickName, mobileNo, password, role } = req.body || {};

    if (!name || !email || !nickName || !mobileNo || !password) {
      return res.status(400).json({ error: 'name, email, nickName, mobileNo and password are required' });
    }

    let roleSID = null;
    if (role) {
      const roleRow = users.findRoleByName(role);
      if (!roleRow) {
        return res.status(400).json({ error: `Unknown role: ${role}` });
      }
      roleSID = roleRow.SID;
    }

    if (users.findUserByEmail(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    try {
      const user = users.createUser({ name, email, nickName, mobileNo, password, createdBySID: req.user.userSID });
      if (roleSID) {
        users.assignRole(user.SID, roleSID);
      }
      res.status(201).json({ userSID: user.SID });
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'name or nickName already taken' });
      }
      throw err;
    }
  }
}

module.exports = new AdminRoutes().router;

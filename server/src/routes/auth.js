const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../db/users');

class AuthRoutes {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.router = express.Router();

    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
  }

  register(req, res) {
    const { name, email, nickName, mobileNo, password } = req.body || {};

    if (!name || !email || !nickName || !mobileNo || !password) {
      return res.status(400).json({ error: 'name, email, nickName, mobileNo and password are required' });
    }

    if (users.findUserByEmail(email)) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    try {
      const user = users.createUser({ name, email, nickName, mobileNo, password });
      res.status(201).json({ userSID: user.SID });
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'name or nickName already taken' });
      }
      throw err;
    }
  }

  login(req, res) {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = users.findUserByEmail(email);
    if (!user || !bcryptjs.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is disabled' });
    }

    const token = jwt.sign({ userSID: user.SID, nickName: user.nickName }, this.jwtSecret, { expiresIn: '7d' });
    const { password: _pw, ...safeUser } = user;
    res.json({ token, user: safeUser });
  }
}

module.exports = new AuthRoutes().router;

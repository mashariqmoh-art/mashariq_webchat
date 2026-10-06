const jwt = require('jsonwebtoken');

class AuthMiddleware {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET;
    this.authenticate = this.authenticate.bind(this);
  }

  authenticate(req, res, next) {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: 'Missing or malformed Authorization header' });
    }

    try {
      req.user = jwt.verify(token, this.jwtSecret);
      next();
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
}

module.exports = new AuthMiddleware();

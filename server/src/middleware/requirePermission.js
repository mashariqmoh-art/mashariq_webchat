const users = require('../db/user');

class PermissionMiddleware {
  requirePermission(permissionName) {
    return (req, res, next) => {
      if (!req.user || !req.user.userSID) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      if (!users.userHasPermission(req.user.userSID, permissionName)) {
        return res.status(403).json({ error: `Missing permission: ${permissionName}` });
      }

      next();
    };
  }
}

module.exports = new PermissionMiddleware();

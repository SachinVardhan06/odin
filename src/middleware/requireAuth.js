const sessions = require('../sessions');
const db = require('../db');

// Rejects requests without a valid bearer token and attaches the user to req.user.
function requireAuth(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }

  const userId = sessions.getUserId(token);
  const user = userId && db.findUserById(userId);

  if (!user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = { id: user.id, username: user.username };
  next();
}

module.exports = requireAuth;

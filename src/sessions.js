const crypto = require('crypto');

const TOKEN_TTL_MS = 60 * 60 * 1000;

const sessions = new Map();

function create(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, { userId, expiresAt: Date.now() + TOKEN_TTL_MS });
  return token;
}

function getUserId(token) {
  const session = sessions.get(token);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    sessions.delete(token);
    return null;
  }
  return session.userId;
}

function clear() {
  sessions.clear();
}

module.exports = { create, getUserId, clear };

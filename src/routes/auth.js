const express = require('express');
const db = require('../db');
const sessions = require('../sessions');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

function profile(user) {
  return { id: user.id, username: user.username, name: user.name, memberSince: user.memberSince };
}

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = username && db.findUserByUsername(username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = sessions.create(user.id);
  res.json({ token, user: { id: user.id, username: user.username } });
});

router.get('/me', requireAuth, (req, res) => {
  res.json(profile(db.findUserById(req.user.id)));
});

router.put('/me', requireAuth, (req, res) => {
  const { name } = req.body || {};

  if (typeof name !== 'string' || !name.trim() || name.trim().length > 60) {
    return res.status(400).json({ error: 'name must be 1 to 60 characters' });
  }

  res.json(profile(db.updateUserName(req.user.id, name.trim())));
});

module.exports = router;

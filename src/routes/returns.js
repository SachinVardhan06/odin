const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

const RETURNABLE_STATUSES = ['delivered'];

router.use(requireAuth);

// List the current user's return requests.
router.get('/', (req, res) => {
  res.json(db.listReturnsByOwner(req.user.id));
});

// Request a return for a delivered order.
router.post('/', (req, res) => {
  const { orderId, reason } = req.body || {};
  const order = db.findOrderById(Number(orderId));

  if (!order || order.ownerId !== req.user.id) {
    return res.status(404).json({ error: 'Order not found' });
  }
  if (!RETURNABLE_STATUSES.includes(order.status)) {
    return res.status(400).json({ error: 'Only delivered orders can be returned' });
  }
  if (db.findReturnByOrderId(order.id)) {
    return res.status(409).json({ error: 'A return has already been requested for this order' });
  }
  if (typeof reason !== 'string' || !reason.trim()) {
    return res.status(400).json({ error: 'reason is required' });
  }

  res.status(201).json(db.createReturn(req.user.id, order, reason.trim()));
});

module.exports = router;

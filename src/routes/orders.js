const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

const UPDATABLE_FIELDS = ['shippingAddress', 'status'];
const ALLOWED_STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];
const MAX_QUANTITY = 10;

router.use(requireAuth);

// List the current user's orders.
router.get('/', (req, res) => {
  res.json(db.listOrdersByOwner(req.user.id));
});

// Place an order for the current user. Prices always come from the catalogue, never the client.
router.post('/', (req, res) => {
  const { items, addressId } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items must be a non-empty array' });
  }
  for (const { productId, quantity } of items) {
    if (!db.findProductById(productId)) {
      return res.status(400).json({ error: `Unknown product: ${productId}` });
    }
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY) {
      return res.status(400).json({ error: `quantity must be between 1 and ${MAX_QUANTITY}` });
    }
  }

  const address = db.findAddressById(addressId);
  if (!address || address.ownerId !== req.user.id) {
    return res.status(400).json({ error: 'Choose one of your saved addresses' });
  }

  const order = db.createOrder(req.user.id, items, db.formatAddress(address));
  res.status(201).json(order);
});

// Get a single order.
router.get('/:id', (req, res) => {
  const order = db.findOrderById(Number(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

// Update a single order.
router.put('/:id', (req, res) => {
  const order = db.findOrderById(Number(req.params.id));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const updates = req.body || {};

  if (updates.status !== undefined && !ALLOWED_STATUSES.includes(updates.status)) {
    return res.status(400).json({ error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` });
  }
  if (updates.shippingAddress !== undefined && (typeof updates.shippingAddress !== 'string' || !updates.shippingAddress.trim())) {
    return res.status(400).json({ error: 'shippingAddress must be a non-empty string' });
  }

  for (const field of UPDATABLE_FIELDS) {
    if (updates[field] !== undefined) {
      order[field] = updates[field];
    }
  }

  res.json(order);
});

module.exports = router;

const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.use(requireAuth);

function findOwnedAddress(req) {
  const address = db.findAddressById(req.params.id);
  if (!address || address.ownerId !== req.user.id) {
    return null;
  }
  return address;
}

// List the current user's saved addresses.
router.get('/', (req, res) => {
  res.json(db.listAddressesByOwner(req.user.id));
});

// Save a new address.
router.post('/', (req, res) => {
  const { label, line1, city, postalCode } = req.body || {};

  if (![label, line1, city, postalCode].every((v) => typeof v === 'string' && v.trim())) {
    return res.status(400).json({ error: 'label, line1, city and postalCode are required' });
  }

  const address = db.createAddress(req.user.id, {
    label: label.trim(),
    line1: line1.trim(),
    city: city.trim(),
    postalCode: postalCode.trim(),
  });
  res.status(201).json(address);
});

// Make an address the default.
router.post('/:id/default', (req, res) => {
  const address = findOwnedAddress(req);

  if (!address) {
    return res.status(404).json({ error: 'Address not found' });
  }

  db.setDefaultAddress(req.user.id, address.id);
  res.json(db.listAddressesByOwner(req.user.id));
});

// Delete an address.
router.delete('/:id', (req, res) => {
  const address = findOwnedAddress(req);

  if (!address) {
    return res.status(404).json({ error: 'Address not found' });
  }

  db.deleteAddress(address.id);
  res.status(204).end();
});

module.exports = router;

const express = require('express');
const db = require('../db');

const router = express.Router();

// Public product catalogue.
router.get('/', (req, res) => {
  res.json(db.listProducts());
});

router.get('/:id', (req, res) => {
  const product = db.findProductById(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

module.exports = router;

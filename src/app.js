const path = require('path');
const express = require('express');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const addressRoutes = require('./routes/addresses');
const returnRoutes = require('./routes/returns');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/', authRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/addresses', addressRoutes);
app.use('/returns', returnRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;

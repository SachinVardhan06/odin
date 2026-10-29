// In-memory data store. Resets every time the server restarts.

const products = [
  { id: 'p-keyboard', name: 'Mechanical keyboard', category: 'keyboard', price: 89.99, color: '#6366f1', rating: 4.8, description: 'Hot-swappable switches, aluminium frame and per-key backlight.' },
  { id: 'p-hub', name: 'USB-C hub', category: 'hub', price: 24.99, color: '#0ea5e9', rating: 4.5, description: '7-in-1 hub with HDMI, SD card reader and 100 W pass-through charging.' },
  { id: 'p-monitor', name: '27-inch monitor', category: 'monitor', price: 329.0, color: '#14b8a6', rating: 4.7, description: '27-inch 4K IPS display with USB-C and a height-adjustable stand.' },
  { id: 'p-mouse', name: 'Wireless mouse', category: 'mouse', price: 39.99, color: '#f59e0b', rating: 4.6, description: 'Silent clicks, 70-day battery and multi-device switching.' },
  { id: 'p-headphones', name: 'Noise-cancelling headphones', category: 'headphones', price: 179.0, color: '#ec4899', rating: 4.9, description: 'Adaptive noise cancelling with 30 hours of playback.' },
  { id: 'p-webcam', name: '1080p webcam', category: 'webcam', price: 59.99, color: '#8b5cf6', rating: 4.3, description: 'Full HD webcam with auto light correction and a privacy shutter.' },
  { id: 'p-lamp', name: 'LED desk lamp', category: 'lamp', price: 34.5, color: '#eab308', rating: 4.4, description: 'Dimmable lamp with five colour temperatures and a USB charging port.' },
  { id: 'p-arm', name: 'Monitor arm', category: 'arm', price: 64.0, color: '#64748b', rating: 4.5, description: 'Gas-spring arm for screens up to 32 inches, with cable management.' },
  { id: 'p-cable', name: 'Braided USB-C cable', category: 'cable', price: 12.99, color: '#ef4444', rating: 4.6, description: '2 m braided cable rated for 240 W charging and 10 Gbps data.' },
  { id: 'p-chair', name: 'Ergonomic office chair', category: 'chair', price: 249.0, color: '#22c55e', rating: 4.7, description: 'Mesh back, adjustable lumbar support and 4D armrests.' },
  { id: 'p-ssd', name: 'Portable SSD 1TB', category: 'storage', price: 99.0, color: '#3b82f6', rating: 4.8, description: 'Pocket-sized SSD with read speeds up to 1,050 MB/s.' },
  { id: 'p-mic', name: 'USB microphone', category: 'mic', price: 89.0, color: '#f97316', rating: 4.5, description: 'Cardioid condenser mic with a zero-latency headphone jack.' },
];

const seedUsers = [
  { id: 'u-alice', username: 'alice', password: 'alice-pass-123', name: 'Alice Carter', memberSince: '2024-03-02' },
  { id: 'u-bob', username: 'bob', password: 'bob-pass-456', name: 'Bob Nguyen', memberSince: '2025-01-19' },
];

const seedAddresses = [
  { id: 'a-101', ownerId: 'u-alice', label: 'Home', line1: '12 Elm Street', city: 'Springfield', postalCode: '62704', isDefault: true },
  { id: 'a-102', ownerId: 'u-alice', label: 'Office', line1: '300 Market Plaza, Suite 4', city: 'Springfield', postalCode: '62701', isDefault: false },
  { id: 'a-103', ownerId: 'u-bob', label: 'Home', line1: '48 Oak Avenue', city: 'Riverton', postalCode: '82501', isDefault: true },
];

const FREE_SHIPPING_FROM = 50;
const SHIPPING_FEE = 5.99;
const TAX_RATE = 0.08;

const round2 = (n) => Math.round(n * 100) / 100;

function priceOrder(lines) {
  const subtotal = round2(lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0));
  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE;
  const tax = round2(subtotal * TAX_RATE);
  return { subtotal, shipping, tax, total: round2(subtotal + shipping + tax) };
}

function line(productId, quantity) {
  const p = products.find((x) => x.id === productId);
  return { productId, name: p.name, unitPrice: p.price, quantity };
}

function seedOrder(id, ownerId, placedAt, status, lines, shippingAddress, shipment = {}) {
  return {
    id,
    ownerId,
    placedAt,
    status,
    items: lines,
    ...priceOrder(lines),
    shippingAddress,
    carrier: shipment.carrier || null,
    trackingNumber: shipment.trackingNumber || null,
    deliveredAt: shipment.deliveredAt || null,
  };
}

const ALICE_HOME = '12 Elm Street, Springfield';
const ALICE_OFFICE = '300 Market Plaza, Suite 4, Springfield';
const BOB_HOME = '48 Oak Avenue, Riverton';

const seedOrders = [
  seedOrder(994, 'u-bob', '2026-08-03T10:12:00Z', 'delivered', [line('p-chair', 1)], BOB_HOME,
    { carrier: 'FedEx', trackingNumber: '7749 2210 5531', deliveredAt: '2026-08-07T15:40:00Z' }),
  seedOrder(995, 'u-alice', '2026-08-19T08:30:00Z', 'delivered', [line('p-headphones', 1)], ALICE_HOME,
    { carrier: 'UPS', trackingNumber: '1Z84F2A10377120013', deliveredAt: '2026-08-22T12:05:00Z' }),
  seedOrder(996, 'u-alice', '2026-09-02T17:48:00Z', 'delivered', [line('p-arm', 1), line('p-cable', 2)], ALICE_OFFICE,
    { carrier: 'USPS', trackingNumber: '9400 1118 9922 3344 5566', deliveredAt: '2026-09-06T10:20:00Z' }),
  seedOrder(997, 'u-bob', '2026-09-11T13:02:00Z', 'delivered', [line('p-mic', 1), line('p-webcam', 1)], BOB_HOME,
    { carrier: 'UPS', trackingNumber: '1Z84F2A10381902274', deliveredAt: '2026-09-15T16:45:00Z' }),
  seedOrder(998, 'u-alice', '2026-09-24T09:15:00Z', 'cancelled', [line('p-ssd', 1)], ALICE_HOME),
  seedOrder(999, 'u-alice', '2026-10-03T19:22:00Z', 'delivered', [line('p-mouse', 1), line('p-lamp', 1)], ALICE_HOME,
    { carrier: 'FedEx', trackingNumber: '7749 2210 9087', deliveredAt: '2026-10-07T11:10:00Z' }),
  seedOrder(1000, 'u-bob', '2026-10-09T07:55:00Z', 'shipped', [line('p-ssd', 1), line('p-cable', 1)], BOB_HOME,
    { carrier: 'UPS', trackingNumber: '1Z84F2A10390044781' }),
  seedOrder(1001, 'u-alice', '2026-10-14T09:42:00Z', 'shipped', [line('p-keyboard', 1)], ALICE_HOME,
    { carrier: 'UPS', trackingNumber: '1Z84F2A10398127745' }),
  seedOrder(1002, 'u-alice', '2026-10-25T16:05:00Z', 'processing', [line('p-hub', 2)], ALICE_HOME),
  seedOrder(1003, 'u-bob', '2026-10-26T11:18:00Z', 'processing', [line('p-monitor', 1)], BOB_HOME),
];

const seedReturns = [
  { id: 'r-5001', ownerId: 'u-alice', orderId: 995, reason: 'Left ear cup crackles at high volume', status: 'refunded', amount: 193.32, createdAt: '2026-08-28T14:00:00Z' },
];

let users = [];
let addresses = [];
let orders = [];
let returns = [];
let nextOrderId = 1004;
let nextAddressId = 104;
let nextReturnId = 5002;

function reset() {
  users = seedUsers.map((u) => ({ ...u }));
  addresses = seedAddresses.map((a) => ({ ...a }));
  orders = seedOrders.map((o) => ({ ...o, items: o.items.map((i) => ({ ...i })) }));
  returns = seedReturns.map((r) => ({ ...r }));
  nextOrderId = 1004;
  nextAddressId = 104;
  nextReturnId = 5002;
}

// ---- Users ----

function findUserByUsername(username) {
  return users.find((u) => u.username === username);
}

function findUserById(id) {
  return users.find((u) => u.id === id);
}

function updateUserName(id, name) {
  const user = findUserById(id);
  user.name = name;
  return user;
}

// ---- Products ----

function listProducts() {
  return products;
}

function findProductById(id) {
  return products.find((p) => p.id === id);
}

// ---- Addresses ----

function formatAddress(address) {
  return `${address.line1}, ${address.city}`;
}

function listAddressesByOwner(ownerId) {
  return addresses.filter((a) => a.ownerId === ownerId);
}

function findAddressById(id) {
  return addresses.find((a) => a.id === id);
}

function createAddress(ownerId, { label, line1, city, postalCode }) {
  const isFirst = listAddressesByOwner(ownerId).length === 0;
  const address = { id: `a-${nextAddressId++}`, ownerId, label, line1, city, postalCode, isDefault: isFirst };
  addresses.push(address);
  return address;
}

function deleteAddress(id) {
  const removed = findAddressById(id);
  addresses = addresses.filter((a) => a.id !== id);
  if (removed && removed.isDefault) {
    const next = addresses.find((a) => a.ownerId === removed.ownerId);
    if (next) next.isDefault = true;
  }
}

function setDefaultAddress(ownerId, id) {
  for (const a of listAddressesByOwner(ownerId)) {
    a.isDefault = a.id === id;
  }
}

// ---- Orders ----

function listOrdersByOwner(ownerId) {
  return orders.filter((o) => o.ownerId === ownerId);
}

function findOrderById(id) {
  return orders.find((o) => o.id === id);
}

function createOrder(ownerId, lines, shippingAddress) {
  const items = lines.map(({ productId, quantity }) => line(productId, quantity));
  const order = {
    id: nextOrderId++,
    ownerId,
    placedAt: new Date().toISOString(),
    status: 'processing',
    items,
    ...priceOrder(items),
    shippingAddress,
    carrier: null,
    trackingNumber: null,
    deliveredAt: null,
  };
  orders.push(order);
  return order;
}

// ---- Returns ----

function listReturnsByOwner(ownerId) {
  return returns.filter((r) => r.ownerId === ownerId);
}

function findReturnByOrderId(orderId) {
  return returns.find((r) => r.orderId === orderId);
}

function createReturn(ownerId, order, reason) {
  const ret = {
    id: `r-${nextReturnId++}`,
    ownerId,
    orderId: order.id,
    reason,
    status: 'requested',
    amount: order.total,
    createdAt: new Date().toISOString(),
  };
  returns.push(ret);
  return ret;
}

reset();

module.exports = {
  reset,
  findUserByUsername,
  findUserById,
  updateUserName,
  listProducts,
  findProductById,
  formatAddress,
  listAddressesByOwner,
  findAddressById,
  createAddress,
  deleteAddress,
  setDefaultAddress,
  listOrdersByOwner,
  findOrderById,
  createOrder,
  listReturnsByOwner,
  findReturnByOrderId,
  createReturn,
};

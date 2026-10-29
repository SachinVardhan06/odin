const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');
const sessions = require('../src/sessions');

async function login(username, password) {
  const res = await request(app).post('/login').send({ username, password });
  return res.body.token;
}

beforeEach(() => {
  db.reset();
  sessions.clear();
});

describe('auth', () => {
  test('login returns a token for valid credentials', async () => {
    const res = await request(app).post('/login').send({ username: 'alice', password: 'alice-pass-123' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('login rejects a wrong password', async () => {
    const res = await request(app).post('/login').send({ username: 'alice', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  test('orders require a bearer token', async () => {
    const res = await request(app).get('/orders');
    expect(res.status).toBe(401);
  });

  test('user can update their display name', async () => {
    const token = await login('alice', 'alice-pass-123');
    const res = await request(app).put('/me').set('Authorization', `Bearer ${token}`).send({ name: 'Alice C.' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Alice C.');
  });
});

describe('orders', () => {
  test('list returns only the current user\'s orders', async () => {
    const token = await login('alice', 'alice-pass-123');
    const res = await request(app).get('/orders').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((o) => o.ownerId === 'u-alice')).toBe(true);
    expect(res.body.map((o) => o.id)).toEqual(expect.arrayContaining([1001, 1002]));
  });

  test('user can read their own order', async () => {
    const token = await login('alice', 'alice-pass-123');
    const res = await request(app).get('/orders/1001').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.items[0].name).toBe('Mechanical keyboard');
  });

  test('user can update their own order', async () => {
    const token = await login('alice', 'alice-pass-123');
    const res = await request(app)
      .put('/orders/1002')
      .set('Authorization', `Bearer ${token}`)
      .send({ shippingAddress: '300 Market Plaza, Suite 4, Springfield' });
    expect(res.status).toBe(200);
    expect(res.body.shippingAddress).toBe('300 Market Plaza, Suite 4, Springfield');
  });

  test('checkout prices the order from the catalogue', async () => {
    const token = await login('bob', 'bob-pass-456');
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: 'p-cable', quantity: 2 }], addressId: 'a-103' });
    expect(res.status).toBe(201);
    expect(res.body.ownerId).toBe('u-bob');
    expect(res.body.subtotal).toBe(25.98);
    expect(res.body.shipping).toBe(5.99);
    expect(res.body.total).toBe(34.05);
  });

  test('checkout rejects another user\'s address', async () => {
    const token = await login('bob', 'bob-pass-456');
    const res = await request(app)
      .post('/orders')
      .set('Authorization', `Bearer ${token}`)
      .send({ items: [{ productId: 'p-cable', quantity: 1 }], addressId: 'a-101' });
    expect(res.status).toBe(400);
  });

  test('unknown order returns 404', async () => {
    const token = await login('alice', 'alice-pass-123');
    const res = await request(app).get('/orders/9999').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe('addresses', () => {
  test('user can add and delete their own address', async () => {
    const token = await login('bob', 'bob-pass-456');
    const created = await request(app)
      .post('/addresses')
      .set('Authorization', `Bearer ${token}`)
      .send({ label: 'Studio', line1: '9 Pine Road', city: 'Riverton', postalCode: '82501' });
    expect(created.status).toBe(201);
    const del = await request(app).delete(`/addresses/${created.body.id}`).set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(204);
  });

  test('user cannot delete another user\'s address', async () => {
    const token = await login('bob', 'bob-pass-456');
    const res = await request(app).delete('/addresses/a-101').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe('returns', () => {
  test('user can request a return for a delivered order', async () => {
    const token = await login('alice', 'alice-pass-123');
    const res = await request(app)
      .post('/returns')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderId: 999, reason: 'Changed my mind' });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('requested');
  });

  test('user cannot return another user\'s order', async () => {
    const token = await login('alice', 'alice-pass-123');
    const res = await request(app)
      .post('/returns')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderId: 997, reason: 'Changed my mind' });
    expect(res.status).toBe(404);
  });
});

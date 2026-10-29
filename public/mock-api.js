/* In-browser stand-in for the REST API, so the portal can run as a static site.
   It mirrors src/routes/ exactly, including the deliberate missing ownership
   check on GET/PUT /orders/:id. Data lives in memory and resets on reload. */

window.installNorthwindMock = function installNorthwindMock() {
  const PRODUCTS = [
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

  const USERS = [
    { id: 'u-alice', username: 'alice', password: 'alice-pass-123', name: 'Alice Carter', memberSince: '2024-03-02' },
    { id: 'u-bob', username: 'bob', password: 'bob-pass-456', name: 'Bob Nguyen', memberSince: '2025-01-19' },
  ];

  const round2 = (n) => Math.round(n * 100) / 100;
  const product = (id) => PRODUCTS.find((p) => p.id === id);

  function priceOrder(items) {
    const subtotal = round2(items.reduce((s, l) => s + l.unitPrice * l.quantity, 0));
    const shipping = subtotal >= 50 ? 0 : 5.99;
    const tax = round2(subtotal * 0.08);
    return { subtotal, shipping, tax, total: round2(subtotal + shipping + tax) };
  }

  const line = (productId, quantity) => {
    const p = product(productId);
    return { productId, name: p.name, unitPrice: p.price, quantity };
  };

  function makeOrder(id, ownerId, placedAt, status, items, shippingAddress, shipment = {}) {
    return {
      id, ownerId, placedAt, status, items, ...priceOrder(items), shippingAddress,
      carrier: shipment.carrier || null,
      trackingNumber: shipment.trackingNumber || null,
      deliveredAt: shipment.deliveredAt || null,
    };
  }

  const ALICE_HOME = '12 Elm Street, Springfield';
  const ALICE_OFFICE = '300 Market Plaza, Suite 4, Springfield';
  const BOB_HOME = '48 Oak Avenue, Riverton';

  const state = {
    users: USERS.map((u) => ({ ...u })),
    sessions: new Map(),
    nextOrderId: 1004,
    nextAddressId: 104,
    nextReturnId: 5002,
    addresses: [
      { id: 'a-101', ownerId: 'u-alice', label: 'Home', line1: '12 Elm Street', city: 'Springfield', postalCode: '62704', isDefault: true },
      { id: 'a-102', ownerId: 'u-alice', label: 'Office', line1: '300 Market Plaza, Suite 4', city: 'Springfield', postalCode: '62701', isDefault: false },
      { id: 'a-103', ownerId: 'u-bob', label: 'Home', line1: '48 Oak Avenue', city: 'Riverton', postalCode: '82501', isDefault: true },
    ],
    orders: [
      makeOrder(994, 'u-bob', '2026-08-03T10:12:00Z', 'delivered', [line('p-chair', 1)], BOB_HOME, { carrier: 'FedEx', trackingNumber: '7749 2210 5531', deliveredAt: '2026-08-07T15:40:00Z' }),
      makeOrder(995, 'u-alice', '2026-08-19T08:30:00Z', 'delivered', [line('p-headphones', 1)], ALICE_HOME, { carrier: 'UPS', trackingNumber: '1Z84F2A10377120013', deliveredAt: '2026-08-22T12:05:00Z' }),
      makeOrder(996, 'u-alice', '2026-09-02T17:48:00Z', 'delivered', [line('p-arm', 1), line('p-cable', 2)], ALICE_OFFICE, { carrier: 'USPS', trackingNumber: '9400 1118 9922 3344 5566', deliveredAt: '2026-09-06T10:20:00Z' }),
      makeOrder(997, 'u-bob', '2026-09-11T13:02:00Z', 'delivered', [line('p-mic', 1), line('p-webcam', 1)], BOB_HOME, { carrier: 'UPS', trackingNumber: '1Z84F2A10381902274', deliveredAt: '2026-09-15T16:45:00Z' }),
      makeOrder(998, 'u-alice', '2026-09-24T09:15:00Z', 'cancelled', [line('p-ssd', 1)], ALICE_HOME),
      makeOrder(999, 'u-alice', '2026-10-03T19:22:00Z', 'delivered', [line('p-mouse', 1), line('p-lamp', 1)], ALICE_HOME, { carrier: 'FedEx', trackingNumber: '7749 2210 9087', deliveredAt: '2026-10-07T11:10:00Z' }),
      makeOrder(1000, 'u-bob', '2026-10-09T07:55:00Z', 'shipped', [line('p-ssd', 1), line('p-cable', 1)], BOB_HOME, { carrier: 'UPS', trackingNumber: '1Z84F2A10390044781' }),
      makeOrder(1001, 'u-alice', '2026-10-14T09:42:00Z', 'shipped', [line('p-keyboard', 1)], ALICE_HOME, { carrier: 'UPS', trackingNumber: '1Z84F2A10398127745' }),
      makeOrder(1002, 'u-alice', '2026-10-25T16:05:00Z', 'processing', [line('p-hub', 2)], ALICE_HOME),
      makeOrder(1003, 'u-bob', '2026-10-26T11:18:00Z', 'processing', [line('p-monitor', 1)], BOB_HOME),
    ],
    returns: [
      { id: 'r-5001', ownerId: 'u-alice', orderId: 995, reason: 'Left ear cup crackles at high volume', status: 'refunded', amount: 193.32, createdAt: '2026-08-28T14:00:00Z' },
    ],
  };

  const json = (status, body) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

  const ok = (body) => json(200, body);
  const notFound = () => json(404, { error: 'Order not found' });

  function currentUser(init) {
    const headers = new Headers((init && init.headers) || {});
    const auth = headers.get('Authorization') || '';
    const [scheme, token] = auth.split(' ');
    if (scheme !== 'Bearer' || !token) return null;
    const userId = state.sessions.get(token);
    return userId ? state.users.find((u) => u.id === userId) : null;
  }

  const profile = (u) => ({ id: u.id, username: u.username, name: u.name, memberSince: u.memberSince });
  const formatAddress = (a) => `${a.line1}, ${a.city}`;
  const ownedAddress = (id, user) => state.addresses.find((a) => a.id === id && a.ownerId === user.id);

  const ALLOWED_STATUSES = ['processing', 'shipped', 'delivered', 'cancelled'];

  function handle(path, method, body, init) {
    // ---- Public ----
    if (path === '/health') return ok({ status: 'ok' });
    if (path === '/products' && method === 'GET') return ok(PRODUCTS);

    if (path === '/login' && method === 'POST') {
      const user = state.users.find((u) => u.username === body.username);
      if (!user || user.password !== body.password) {
        return json(401, { error: 'Invalid username or password' });
      }
      const token = `tok-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
      state.sessions.set(token, user.id);
      return ok({ token, user: { id: user.id, username: user.username } });
    }

    // ---- Everything below needs a bearer token ----
    const user = currentUser(init);
    if (!user) return json(401, { error: 'Missing bearer token' });

    if (path === '/me') {
      if (method === 'PUT') {
        const name = (body.name || '').trim();
        if (!name || name.length > 60) return json(400, { error: 'name must be 1 to 60 characters' });
        user.name = name;
      }
      return ok(profile(user));
    }

    // ---- Orders ----
    if (path === '/orders' && method === 'GET') {
      return ok(state.orders.filter((o) => o.ownerId === user.id));
    }

    if (path === '/orders' && method === 'POST') {
      const items = body.items;
      if (!Array.isArray(items) || items.length === 0) {
        return json(400, { error: 'items must be a non-empty array' });
      }
      for (const it of items) {
        if (!product(it.productId)) return json(400, { error: `Unknown product: ${it.productId}` });
        if (!Number.isInteger(it.quantity) || it.quantity < 1 || it.quantity > 10) {
          return json(400, { error: 'quantity must be between 1 and 10' });
        }
      }
      const address = ownedAddress(body.addressId, user);
      if (!address) return json(400, { error: 'Choose one of your saved addresses' });

      const lines = items.map((i) => line(i.productId, i.quantity));
      const order = {
        id: state.nextOrderId++,
        ownerId: user.id,
        placedAt: new Date().toISOString(),
        status: 'processing',
        items: lines,
        ...priceOrder(lines),
        shippingAddress: formatAddress(address),
        carrier: null,
        trackingNumber: null,
        deliveredAt: null,
      };
      state.orders.push(order);
      return json(201, order);
    }

    const orderMatch = path.match(/^\/orders\/(\d+)$/);
    if (orderMatch) {
      // Deliberate flaw, mirroring src/routes/orders.js: the caller is authenticated
      // but the order is never checked against req.user.id.
      const order = state.orders.find((o) => o.id === Number(orderMatch[1]));
      if (!order) return notFound();

      if (method === 'GET') return ok(order);

      if (method === 'PUT') {
        if (body.status !== undefined && !ALLOWED_STATUSES.includes(body.status)) {
          return json(400, { error: `status must be one of: ${ALLOWED_STATUSES.join(', ')}` });
        }
        if (body.shippingAddress !== undefined) {
          if (typeof body.shippingAddress !== 'string' || !body.shippingAddress.trim()) {
            return json(400, { error: 'shippingAddress must be a non-empty string' });
          }
          order.shippingAddress = body.shippingAddress;
        }
        if (body.status !== undefined) order.status = body.status;
        return ok(order);
      }
    }

    // ---- Addresses ----
    if (path === '/addresses' && method === 'GET') {
      return ok(state.addresses.filter((a) => a.ownerId === user.id));
    }

    if (path === '/addresses' && method === 'POST') {
      const { label, line1, city, postalCode } = body;
      if (![label, line1, city, postalCode].every((v) => typeof v === 'string' && v.trim())) {
        return json(400, { error: 'label, line1, city and postalCode are required' });
      }
      const mine = state.addresses.filter((a) => a.ownerId === user.id);
      const address = {
        id: `a-${state.nextAddressId++}`,
        ownerId: user.id,
        label: label.trim(),
        line1: line1.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        isDefault: mine.length === 0,
      };
      state.addresses.push(address);
      return json(201, address);
    }

    const defaultMatch = path.match(/^\/addresses\/([\w-]+)\/default$/);
    if (defaultMatch && method === 'POST') {
      const address = ownedAddress(defaultMatch[1], user);
      if (!address) return json(404, { error: 'Address not found' });
      state.addresses.filter((a) => a.ownerId === user.id).forEach((a) => { a.isDefault = a === address; });
      return ok(state.addresses.filter((a) => a.ownerId === user.id));
    }

    const addressMatch = path.match(/^\/addresses\/([\w-]+)$/);
    if (addressMatch && method === 'DELETE') {
      const address = ownedAddress(addressMatch[1], user);
      if (!address) return json(404, { error: 'Address not found' });
      state.addresses = state.addresses.filter((a) => a !== address);
      if (address.isDefault) {
        const next = state.addresses.find((a) => a.ownerId === user.id);
        if (next) next.isDefault = true;
      }
      return new Response(null, { status: 204 });
    }

    // ---- Returns ----
    if (path === '/returns' && method === 'GET') {
      return ok(state.returns.filter((r) => r.ownerId === user.id));
    }

    if (path === '/returns' && method === 'POST') {
      const order = state.orders.find((o) => o.id === Number(body.orderId));
      if (!order || order.ownerId !== user.id) return notFound();
      if (order.status !== 'delivered') return json(400, { error: 'Only delivered orders can be returned' });
      if (state.returns.some((r) => r.orderId === order.id)) {
        return json(409, { error: 'A return has already been requested for this order' });
      }
      const reason = (body.reason || '').trim();
      if (!reason) return json(400, { error: 'reason is required' });

      const ret = {
        id: `r-${state.nextReturnId++}`,
        ownerId: user.id,
        orderId: order.id,
        reason,
        status: 'requested',
        amount: order.total,
        createdAt: new Date().toISOString(),
      };
      state.returns.push(ret);
      return json(201, ret);
    }

    return json(404, { error: 'Not found' });
  }

  const API_PATHS = /^\/(login|me|products|orders|addresses|returns|health)(\/|$)/;
  const realFetch = window.fetch.bind(window);

  window.fetch = function northwindFetch(input, init) {
    const url = typeof input === 'string' ? input : input.url;
    let path;
    try {
      path = new URL(url, location.href).pathname;
    } catch (e) {
      return realFetch(input, init);
    }
    if (!API_PATHS.test(path)) return realFetch(input, init);

    const method = ((init && init.method) || 'GET').toUpperCase();
    let body = {};
    try {
      if (init && init.body) body = JSON.parse(init.body);
    } catch (e) { /* leave body empty */ }

    // A touch of latency so loading states behave like the real thing.
    return new Promise((resolve) => {
      setTimeout(() => resolve(handle(path, method, body, init)), 120);
    });
  };
};

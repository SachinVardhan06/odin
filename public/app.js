/* Northwind customer portal: single-page app over the order-api REST endpoints. */

(function () {
  'use strict';

  /* =====================================================================
     Icons and product art (static, trusted SVG)
     ===================================================================== */

  const SVG = (body, extra = '') =>
    `<svg class="i ${extra}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

  const ICONS = {
    logo: '<path d="M7 17V7l10 10V7" stroke-width="2.6"/>',
    bag: '<path d="M6 7h12l1 13H5L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    box: '<path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/>',
    return: '<path d="M9 14l-5-5 5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
    pin: '<path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.2a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 7H6"/>',
    'chevron-down': '<path d="M6 9l6 6 6-6"/>',
    'chevron-right': '<path d="M9 18l6-6-6-6"/>',
    'chevron-left': '<path d="M15 18l-6-6 6-6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    logout: '<path d="M15 17l5-5-5-5M20 12H9M12 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/>',
    check: '<path d="M5 12l5 5L20 7" stroke-width="3"/>',
    'check-circle': '<circle cx="12" cy="12" r="9" stroke="#4ade80"/><path d="M8 12l3 3 5-6" stroke="#4ade80"/>',
    x: '<path d="M6 6l12 12M18 6L6 18" stroke-width="3"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    laptop: '<rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/>',
    star: '<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9L12 3z" fill="currentColor" stroke="none"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    truck: '<path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/>',
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z"/>',
    building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
    alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.9-3M4 4v4h4M4 13a8 8 0 0 0 14.9 3M20 20v-4h-4"/>',
    card: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/>',
  };

  function iconHtml(name, size) {
    return SVG(ICONS[name] || '', size === 'lg' ? 'i-lg' : '');
  }

  const ART = {
    keyboard: '<rect x="5" y="15" width="38" height="18" rx="3"/><path d="M10 21h2M15 21h2M20 21h2M25 21h2M30 21h2M35 21h3M10 26h3M16 26h2M21 26h2M26 26h2M31 26h2M36 26h2M15 30h18"/>',
    hub: '<rect x="9" y="17" width="26" height="14" rx="4"/><path d="M14 24h3M20 24h3M26 24h3M35 24h4a3 3 0 0 0 3-3v-6"/><rect x="39" y="10" width="6" height="5" rx="1"/>',
    monitor: '<rect x="6" y="8" width="36" height="24" rx="2.5"/><path d="M24 32v7M16 40h16"/>',
    mouse: '<rect x="14" y="7" width="20" height="34" rx="10"/><path d="M24 7v11M14 18h20"/>',
    headphones: '<path d="M9 30v-6a15 15 0 0 1 30 0v6"/><rect x="7" y="28" width="8" height="12" rx="3"/><rect x="33" y="28" width="8" height="12" rx="3"/>',
    webcam: '<circle cx="24" cy="20" r="11"/><circle cx="24" cy="20" r="4.5"/><path d="M17 37h14M24 31v6"/>',
    lamp: '<path d="M14 40h20M24 40V24l-8-10"/><path d="M10 10l12 4-4 10z"/><path d="M14 22l4 4"/>',
    arm: '<path d="M10 40h10M15 40V30l12-8 6 6"/><rect x="31" y="8" width="12" height="18" rx="1.5" transform="rotate(20 37 17)"/>',
    cable: '<path d="M8 34c6 0 6-8 12-8s6 8 12 8"/><rect x="4" y="30" width="6" height="8" rx="1.5"/><rect x="34" y="10" width="6" height="8" rx="1.5"/><path d="M37 18v6c0 6-5 10-9 4"/>',
    chair: '<path d="M16 8h16v16H16z"/><path d="M13 26h22M24 26v8M16 40l8-6 8 6M14 20v6M34 20v6"/>',
    storage: '<rect x="11" y="6" width="26" height="36" rx="4"/><path d="M17 34h14"/><circle cx="24" cy="18" r="5"/>',
    mic: '<rect x="18" y="6" width="12" height="20" rx="6"/><path d="M12 22a12 12 0 0 0 24 0M24 34v6M17 40h14"/>',
  };

  function artNode(product, size) {
    const node = h('div', { class: `art ${size ? `art-${size}` : ''}`, style: `--c:${product.color || '#6366f1'}` });
    node.innerHTML = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ART[product.category] || ART.storage}</svg>`;
    return node;
  }

  /* =====================================================================
     Small DOM helpers
     ===================================================================== */

  function h(tag, props, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props || {})) {
      if (value === undefined || value === null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'style') node.setAttribute('style', value);
      else if (key.startsWith('on')) node.addEventListener(key.slice(2).toLowerCase(), value);
      else if (key === 'value') node.value = value;
      else node.setAttribute(key, value === true ? '' : value);
    }
    append(node, children);
    return node;
  }

  function append(node, children) {
    for (const child of children.flat(Infinity)) {
      if (child === null || child === undefined || child === false) continue;
      node.appendChild(child instanceof Node ? child : document.createTextNode(String(child)));
    }
  }

  function icon(name, size) {
    const span = document.createElement('span');
    span.style.display = 'inline-flex';
    span.innerHTML = iconHtml(name, size);
    return span;
  }

  const $ = (id) => document.getElementById(id);
  const money = (n) => Number(n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—');
  const fmtDateTime = (iso) => (iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—');
  const initials = (name) => name.split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  function badge(status) {
    return h('span', { class: `badge dot b-${status}` }, cap(status));
  }

  /* =====================================================================
     Storage, API, state
     ===================================================================== */

  const store = {
    get(area, key) { try { return window[area].getItem(key); } catch (e) { return null; } },
    set(area, key, value) {
      try {
        if (value === null) window[area].removeItem(key);
        else window[area].setItem(key, value);
      } catch (e) { /* storage unavailable */ }
    },
  };

  const getToken = () => store.get('sessionStorage', 'token');
  const setToken = (t) => store.set('sessionStorage', 'token', t);

  const state = { me: null, products: null, cart: [], memoryCart: [] };

  async function api(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    let res;
    try {
      res = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    } catch (e) {
      return { status: 0, data: { error: 'Network error. Is the server running?' } };
    }
    const data = res.status === 204 ? {} : await res.json().catch(() => ({}));
    if (res.status === 401 && path !== '/login') {
      signOut();
    }
    return { status: res.status, data };
  }

  async function loadMe(force) {
    if (state.me && !force) return state.me;
    const { status, data } = await api('GET', '/me');
    if (status !== 200) return null;
    state.me = data;
    $('avatar').textContent = initials(data.name);
    $('menu-name').textContent = data.name;
    $('menu-handle').textContent = `@${data.username}`;
    loadCart();
    return data;
  }

  async function loadProducts() {
    if (state.products) return state.products;
    const { status, data } = await api('GET', '/products');
    state.products = status === 200 ? data : [];
    return state.products;
  }

  const productById = (id) => (state.products || []).find((p) => p.id === id);

  /* ---------- Cart ---------- */

  const cartKey = () => (state.me ? `cart:${state.me.id}` : null);

  function loadCart() {
    const raw = cartKey() && store.get('localStorage', cartKey());
    try { state.cart = raw ? JSON.parse(raw) : state.memoryCart; } catch (e) { state.cart = []; }
    renderCartCount(false);
  }

  function saveCart(bump) {
    state.memoryCart = state.cart;
    if (cartKey()) store.set('localStorage', cartKey(), JSON.stringify(state.cart));
    renderCartCount(bump);
  }

  function addToCart(productId, quantity = 1) {
    const existing = state.cart.find((l) => l.productId === productId);
    if (existing) existing.quantity = Math.min(10, existing.quantity + quantity);
    else state.cart.push({ productId, quantity: Math.min(10, quantity) });
    saveCart(true);
  }

  function renderCartCount(bump) {
    const count = state.cart.reduce((n, l) => n + l.quantity, 0);
    const node = $('cart-count');
    node.textContent = count;
    node.classList.toggle('hidden', count === 0);
    if (bump) {
      node.classList.remove('bump');
      void node.offsetWidth;
      node.classList.add('bump');
    }
  }

  function priceCart(lines) {
    const subtotal = Math.round(lines.reduce((s, l) => s + l.product.price * l.quantity, 0) * 100) / 100;
    const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 5.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    return { subtotal, shipping, tax, total: Math.round((subtotal + shipping + tax) * 100) / 100 };
  }

  /* =====================================================================
     Theme
     ===================================================================== */

  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const themePref = () => store.get('localStorage', 'theme') || 'system';

  function applyTheme() {
    const pref = themePref();
    const dark = pref === 'dark' || (pref === 'system' && media.matches);
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    $('theme-btn').innerHTML = iconHtml(dark ? 'sun' : 'moon', 'lg');
  }

  function setTheme(pref) {
    store.set('localStorage', 'theme', pref === 'system' ? null : pref);
    applyTheme();
  }

  media.addEventListener('change', applyTheme);

  /* =====================================================================
     Toast and modal
     ===================================================================== */

  function toast(message) {
    $('toast-text').textContent = message;
    $('toast').classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => $('toast').classList.remove('show'), 2600);
  }

  function openModal({ title, description, body, confirmText = 'Save', danger = false, onConfirm }) {
    const error = h('div', { class: 'notice notice-error' });
    const confirm = h('button', { class: `btn ${danger ? 'btn-danger' : 'btn-primary'}`, type: 'submit' }, confirmText);
    const close = () => root.replaceChildren();
    const form = h('form', {
      class: 'modal', role: 'dialog', 'aria-modal': 'true',
      onSubmit: async (e) => {
        e.preventDefault();
        confirm.disabled = true;
        const result = await onConfirm(form);
        confirm.disabled = false;
        if (typeof result === 'string') error.textContent = result;
        else close();
      },
    },
    h('div', { class: 'modal-h' }, h('h2', {}, title), description ? h('p', {}, description) : null),
    h('div', { class: 'modal-b' }, body || null, error),
    h('div', { class: 'modal-f' }, h('button', { class: 'btn btn-secondary', type: 'button', onClick: close }, 'Cancel'), confirm));

    const root = $('modal-root');
    const backdrop = h('div', { class: 'modal-backdrop', onMousedown: (e) => { if (e.target === backdrop) close(); } }, form);
    root.replaceChildren(backdrop);
    const first = form.querySelector('input, select, textarea, button[type="submit"]');
    if (first) first.focus();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      $('modal-root').replaceChildren();
      $('account-menu').classList.add('hidden');
    }
  });

  /* =====================================================================
     Layout
     ===================================================================== */

  function showApp(routeName) {
    $('view-login').classList.add('hidden');
    $('app').classList.remove('hidden');
    $('account-menu').classList.add('hidden');
    document.querySelectorAll('[data-route]').forEach((a) => a.classList.toggle('active', a.dataset.route === routeName));
  }

  function render(...nodes) {
    const page = $('page');
    page.replaceChildren(h('div', { class: 'view' }, nodes));
    window.scrollTo(0, 0);
  }

  function pageHead(title, subtitle, actions) {
    return h('div', { class: 'page-head' },
      h('div', {}, h('h1', {}, title), subtitle ? h('p', {}, subtitle) : null),
      actions ? h('div', { class: 'actions' }, actions) : null);
  }

  function emptyState(iconName, title, text, action, danger) {
    return h('div', { class: 'state' },
      h('div', { class: `state-icon ${danger ? 'danger' : ''}` }, icon(iconName, 'lg')),
      h('h2', {}, title), h('p', {}, text), action || null);
  }

  function skeletonRows(n) {
    return h('div', { class: 'card' }, Array.from({ length: n }, () =>
      h('div', { class: 'sk-row' },
        h('div', { class: 'sk', style: 'width:44px;height:44px;border-radius:10px' }),
        h('div', { style: 'flex:1' }, h('div', { class: 'sk sk-line', style: 'width:40%' }), h('div', { class: 'sk sk-line', style: 'width:22%' })),
        h('div', { class: 'sk sk-line', style: 'width:70px' }))));
  }

  /* =====================================================================
     Pages
     ===================================================================== */

  /* ---------- Sign in ---------- */

  async function pageLogin() {
    $('app').classList.add('hidden');
    $('view-login').classList.remove('hidden');
    const products = await loadProducts();
    $('login-collage').replaceChildren(...products.slice(0, 6).map((p) => artNode(p)));
    $('username').focus();
  }

  /* ---------- Orders ---------- */

  async function pageOrders() {
    showApp('orders');
    render(skeletonRows(4));
    const [me, , res] = await Promise.all([loadMe(), loadProducts(), api('GET', '/orders')]);
    if (res.status !== 200 || !me) return;

    const orders = res.data.slice().sort((a, b) => String(b.placedAt).localeCompare(String(a.placedAt)));
    const active = orders.filter((o) => o.status === 'processing' || o.status === 'shipped').length;
    const delivered = orders.filter((o) => o.status === 'delivered').length;
    const spent = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

    const welcome = h('section', { class: 'welcome' },
      h('div', { class: 'welcome-top' },
        h('div', {}, h('h1', {}, `Welcome back, ${me.name.split(' ')[0]}`), h('p', {}, 'Here is what is happening with your orders.')),
        h('a', { class: 'btn btn-secondary', href: '#/shop' }, icon('bag'), 'Continue shopping')),
      h('div', { class: 'welcome-stats' },
        h('div', { class: 'wstat' }, h('span', {}, 'Active orders'), h('strong', { class: 'num' }, active)),
        h('div', { class: 'wstat' }, h('span', {}, 'Delivered'), h('strong', { class: 'num' }, delivered)),
        h('div', { class: 'wstat' }, h('span', {}, 'Total spent'), h('strong', { class: 'num' }, money(spent)))));

    let filter = 'all';
    const filters = ['all', 'processing', 'shipped', 'delivered', 'cancelled'];
    const tabs = h('div', { class: 'tabs', role: 'tablist' });
    const search = h('input', { class: 'input', placeholder: 'Search by product or order number', 'aria-label': 'Search orders' });
    const body = h('tbody');
    const empty = h('div', { class: 'hidden' }, emptyState('box', 'No orders here', 'Try a different filter or search term.'));

    function drawTabs() {
      tabs.replaceChildren(...filters.map((f) => {
        const n = f === 'all' ? orders.length : orders.filter((o) => o.status === f).length;
        return h('button', { class: f === filter ? 'on' : '', type: 'button', onClick: () => { filter = f; drawTabs(); drawRows(); } },
          f === 'all' ? 'All' : cap(f), h('span', { class: 'count' }, n));
      }));
    }

    function drawRows() {
      const q = search.value.trim().toLowerCase();
      const rows = orders
        .filter((o) => filter === 'all' || o.status === filter)
        .filter((o) => !q || String(o.id).includes(q) || o.items.some((i) => i.name.toLowerCase().includes(q)));
      empty.classList.toggle('hidden', rows.length > 0);
      body.replaceChildren(...rows.map((o) => {
        const first = o.items[0];
        const units = o.items.reduce((n, i) => n + i.quantity, 0);
        const stack = h('div', { class: 'art-stack' }, o.items.slice(0, 3).map((i) => artNode(productById(i.productId) || {}, 'sm')));
        return h('tr', { class: 'clickable', onClick: () => { location.hash = `#/orders/${o.id}`; } },
          h('td', {}, h('div', { class: 'cell-prod' }, stack,
            h('div', {}, h('strong', {}, first.name), h('span', {}, o.items.length > 1 ? `+ ${o.items.length - 1} more · ${units} items` : `${units} item${units > 1 ? 's' : ''}`)))),
          h('td', { class: 'num muted hide-sm' }, `#${o.id}`),
          h('td', { class: 'muted hide-sm' }, fmtDate(o.placedAt)),
          h('td', {}, badge(o.status)),
          h('td', { class: 'num right' }, money(o.total)),
          h('td', { class: 'chev right' }, icon('chevron-right')));
      }));
    }

    search.addEventListener('input', drawRows);
    drawTabs();
    drawRows();

    render(
      welcome,
      h('div', { class: 'card' },
        h('div', { class: 'toolbar' }, tabs, h('div', { class: 'search' }, icon('search'), search)),
        orders.length === 0
          ? emptyState('bag', 'No orders yet', 'When you place an order it will show up here.', h('a', { class: 'btn btn-primary', href: '#/shop' }, 'Start shopping'))
          : [h('table', {},
            h('thead', {}, h('tr', {}, h('th', {}, 'Order'), h('th', { class: 'hide-sm' }, 'Number'), h('th', { class: 'hide-sm' }, 'Placed'), h('th', {}, 'Status'), h('th', { class: 'right' }, 'Total'), h('th', { class: 'chev' }))),
            body), empty]));
  }

  /* ---------- Order detail ---------- */

  function deliverySteps(order) {
    const reachedIndex = { processing: 1, shipped: 2, delivered: 3 }[order.status] ?? 1;
    const steps = [
      ['Order placed', fmtDateTime(order.placedAt)],
      ['Processing', 'Your items are being packed'],
      ['Shipped', order.carrier ? `Handed to ${order.carrier}` : 'Waiting for carrier pickup'],
      ['Delivered', order.deliveredAt ? fmtDateTime(order.deliveredAt) : 'Estimated 2–4 business days'],
    ];

    if (order.status === 'cancelled') {
      return h('ol', { class: 'steps' },
        h('li', { class: 'done' }, h('div', { class: 'step-dot' }, icon('check')), h('div', {}, h('strong', {}, steps[0][0]), h('span', {}, steps[0][1]))),
        h('li', { class: 'cancel' }, h('div', { class: 'step-dot' }, icon('x')), h('div', {}, h('strong', {}, 'Cancelled'), h('span', {}, 'This order will not be shipped'))));
    }

    return h('ol', { class: 'steps' }, steps.map(([title, sub], i) => {
      const done = i < reachedIndex || (i === reachedIndex && order.status === 'delivered');
      const current = i === reachedIndex && order.status !== 'delivered';
      return h('li', { class: done ? 'done' : current ? 'current' : '' },
        h('div', { class: 'step-dot' }, done ? icon('check') : null),
        h('div', {}, h('strong', {}, title), h('span', {}, sub)));
    }));
  }

  async function pageOrder(id) {
    showApp('orders');
    render(skeletonRows(3));
    const [, , res, returnsRes] = await Promise.all([loadMe(), loadProducts(), api('GET', `/orders/${id}`), api('GET', '/returns')]);
    const back = h('a', { class: 'back', href: '#/orders' }, icon('chevron-left'), 'All orders');

    if (res.status !== 200) {
      render(back, h('div', { class: 'card' }, emptyState('alert', 'Order not found',
        res.status === 404 ? "This order doesn't exist or isn't linked to your account." : (res.data.error || 'Something went wrong.'),
        h('a', { class: 'btn btn-secondary', href: '#/orders' }, 'Back to orders'), true)));
      return;
    }

    const order = res.data;
    const existingReturn = (returnsRes.data || []).find?.((r) => r.orderId === order.id);

    const actions = [
      h('button', { class: 'btn btn-secondary', type: 'button', onClick: () => {
        order.items.forEach((i) => addToCart(i.productId, i.quantity));
        toast('Items added to your cart');
      } }, icon('refresh'), 'Buy again'),
    ];
    if (order.status === 'delivered' && !existingReturn) {
      actions.push(h('button', { class: 'btn btn-primary', type: 'button', onClick: () => requestReturn(order) }, icon('return'), 'Request return'));
    }

    const items = h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h2', {}, `Items (${order.items.length})`)),
      order.items.map((i) => h('div', { class: 'line' },
        artNode(productById(i.productId) || {}, 'md'),
        h('div', { class: 'line-meta' }, h('strong', {}, i.name), h('span', {}, `${i.quantity} × ${money(i.unitPrice)}`)),
        h('div', { class: 'line-total num' }, money(i.unitPrice * i.quantity)))));

    const tracking = order.trackingNumber
      ? h('div', { class: 'tracking' }, h('span', { class: 'muted', style: 'display:flex;gap:8px;align-items:center' }, icon('truck'), `${order.carrier} tracking number`), h('code', {}, order.trackingNumber))
      : null;

    const delivery = h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h2', {}, 'Delivery'), existingReturn ? h('span', { class: `badge dot b-${existingReturn.status}` }, `Return ${existingReturn.status}`) : null),
      h('div', { class: 'card-b' }, deliverySteps(order), tracking));

    const addressInput = h('input', { class: 'input', id: 'edit-address', value: order.shippingAddress, required: true });
    const statusSelect = h('select', { class: 'input', id: 'edit-status' },
      ['processing', 'shipped', 'delivered', 'cancelled'].map((s) => h('option', { value: s, selected: s === order.status }, cap(s))));
    const editError = h('div', { class: 'notice notice-error' });
    const manage = h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h2', {}, 'Manage order')),
      h('form', { class: 'card-b', id: 'edit-form', onSubmit: async (e) => {
        e.preventDefault();
        const r = await api('PUT', `/orders/${order.id}`, { shippingAddress: addressInput.value, status: statusSelect.value });
        if (r.status === 200) {
          toast(`Order #${order.id} updated`);
          pageOrder(order.id);
        } else {
          editError.textContent = r.data.error || 'Could not update this order.';
        }
      } },
      h('div', { class: 'form-row' },
        h('div', { class: 'field' }, h('label', { for: 'edit-address' }, 'Shipping address'), addressInput),
        h('div', { class: 'field' }, h('label', { for: 'edit-status' }, 'Status'), statusSelect)),
      h('button', { class: 'btn btn-primary', type: 'submit' }, 'Save changes'),
      editError));

    const summary = h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h2', {}, 'Summary')),
      h('div', { class: 'card-b summary num' },
        h('div', {}, h('span', {}, 'Subtotal'), h('span', {}, money(order.subtotal))),
        h('div', {}, h('span', {}, 'Shipping'), h('span', {}, order.shipping ? money(order.shipping) : 'Free')),
        h('div', {}, h('span', {}, 'Tax'), h('span', {}, money(order.tax))),
        h('div', { class: 'total' }, h('span', {}, 'Total'), h('span', {}, money(order.total)))));

    const info = h('div', { class: 'card' }, h('div', { class: 'card-b' },
      h('div', { class: 'info' }, h('h3', {}, 'Ship to'), h('p', {}, order.shippingAddress)),
      h('div', { class: 'info' }, h('h3', {}, 'Payment'), h('p', { style: 'display:flex;gap:8px;align-items:center' }, icon('card'), 'Card on file')),
      h('div', { class: 'info' }, h('h3', {}, 'Order number'), h('p', { class: 'num' }, `#${order.id}`))));

    render(
      back,
      h('div', { class: 'page-head' },
        h('div', {},
          h('div', { class: 'title-row' }, h('h1', {}, `Order #${order.id}`), badge(order.status)),
          h('p', {}, `Placed ${fmtDateTime(order.placedAt)}`)),
        h('div', { class: 'actions' }, actions)),
      h('div', { class: 'two-col' },
        h('div', { class: 'stack' }, items, delivery, manage),
        h('aside', { class: 'stack sticky' }, summary, info)));
  }

  function requestReturn(order) {
    const reason = h('select', { class: 'input', id: 'return-reason' },
      ['Arrived damaged', 'Not as described', 'Wrong item received', 'No longer needed', 'Other'].map((r) => h('option', { value: r }, r)));
    const details = h('textarea', { class: 'input', rows: '3', style: 'height:auto;padding:10px 12px;resize:vertical', placeholder: 'Anything else we should know? (optional)' });
    openModal({
      title: `Return order #${order.id}`,
      description: `You'll be refunded ${money(order.total)} once we receive the items.`,
      confirmText: 'Submit request',
      body: [h('div', { class: 'field' }, h('label', { for: 'return-reason' }, 'Reason'), reason),
        h('div', { class: 'field', style: 'margin-bottom:0' }, h('label', {}, 'Details'), details)],
      onConfirm: async () => {
        const text = details.value.trim() ? `${reason.value}: ${details.value.trim()}` : reason.value;
        const r = await api('POST', '/returns', { orderId: order.id, reason: text });
        if (r.status !== 201) return r.data.error || 'Could not submit the return.';
        toast('Return requested');
        location.hash = '#/returns';
      },
    });
  }

  /* ---------- Shop ---------- */

  const GROUPS = {
    All: null,
    Peripherals: ['keyboard', 'mouse', 'webcam'],
    Displays: ['monitor', 'arm'],
    Audio: ['headphones', 'mic'],
    Workspace: ['lamp', 'chair'],
    Accessories: ['hub', 'cable', 'storage'],
  };

  async function pageShop() {
    showApp('shop');
    render(h('div', { class: 'grid' }, Array.from({ length: 8 }, () => h('div', { class: 'sk sk-card' }))));
    await loadMe();
    const products = await loadProducts();

    let group = 'All';
    const chips = h('div', { class: 'chips' });
    const grid = h('div', { class: 'grid' });

    function draw() {
      chips.replaceChildren(...Object.keys(GROUPS).map((g) =>
        h('button', { class: `chip ${g === group ? 'on' : ''}`, type: 'button', onClick: () => { group = g; draw(); } }, g)));
      const list = products.filter((p) => !GROUPS[group] || GROUPS[group].includes(p.category));
      grid.replaceChildren(...list.map((p) => h('article', { class: 'card product' },
        artNode(p),
        h('div', { class: 'product-b' },
          h('div', { class: 'rating' }, icon('star'), h('span', {}, `${p.rating.toFixed(1)}`)),
          h('h3', {}, p.name),
          h('p', {}, p.description),
          h('div', { class: 'product-f' },
            h('span', { class: 'price num' }, money(p.price)),
            h('button', { class: 'btn btn-primary btn-sm', type: 'button', onClick: () => { addToCart(p.id); toast(`${p.name} added to cart`); } }, icon('plus'), 'Add'))))));
    }
    draw();

    const featured = ['p-headphones', 'p-keyboard', 'p-monitor'].map(productById).filter(Boolean);
    render(
      h('section', { class: 'shop-hero' },
        h('div', {},
          h('span', { class: 'eyebrow' }, 'New season'),
          h('h1', {}, 'Upgrade your desk setup'),
          h('p', {}, 'Hand-picked gear for focused work. Free shipping on orders over $50 and 30-day returns.'),
          h('a', { class: 'btn btn-primary btn-lg', href: '#/cart' }, icon('cart'), 'View cart')),
        h('div', { class: 'hero-art' }, featured.map((p) => artNode(p)))),
      chips,
      grid);
  }

  /* ---------- Cart & checkout ---------- */

  async function pageCart() {
    showApp('cart');
    render(skeletonRows(3));
    await Promise.all([loadMe(), loadProducts()]);
    const addrRes = await api('GET', '/addresses');
    const addresses = addrRes.status === 200 ? addrRes.data : [];

    const lines = state.cart.map((l) => ({ ...l, product: productById(l.productId) })).filter((l) => l.product);
    if (lines.length === 0) {
      render(pageHead('Cart'), h('div', { class: 'card' }, emptyState('cart', 'Your cart is empty', 'Browse the shop and add a few things you like.',
        h('a', { class: 'btn btn-primary', href: '#/shop' }, 'Go to shop'))));
      return;
    }

    const totals = priceCart(lines);
    const toFree = Math.max(0, 50 - totals.subtotal);

    const setQty = (productId, qty) => {
      const line = state.cart.find((l) => l.productId === productId);
      if (!line) return;
      if (qty <= 0) state.cart = state.cart.filter((l) => l.productId !== productId);
      else line.quantity = Math.min(10, qty);
      saveCart(false);
      pageCart();
    };

    const list = h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h2', {}, `Cart (${lines.reduce((n, l) => n + l.quantity, 0)} items)`),
        h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => { state.cart = []; saveCart(false); pageCart(); } }, 'Clear cart')),
      lines.map((l) => h('div', { class: 'line' },
        artNode(l.product, 'md'),
        h('div', { class: 'line-meta' }, h('strong', {}, l.product.name), h('span', {}, `${money(l.product.price)} each`)),
        h('div', { class: 'stepper' },
          h('button', { type: 'button', 'aria-label': 'Decrease quantity', onClick: () => setQty(l.productId, l.quantity - 1) }, icon('minus')),
          h('span', { class: 'num' }, l.quantity),
          h('button', { type: 'button', 'aria-label': 'Increase quantity', onClick: () => setQty(l.productId, l.quantity + 1) }, icon('plus'))),
        h('div', { class: 'line-total num' }, money(l.product.price * l.quantity)),
        h('button', { class: 'remove', type: 'button', 'aria-label': `Remove ${l.product.name}`, onClick: () => setQty(l.productId, 0) }, icon('trash')))));

    const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
    const addressSelect = h('select', { class: 'input', id: 'checkout-address' },
      addresses.map((a) => h('option', { value: a.id, selected: defaultAddr && a.id === defaultAddr.id }, `${a.label} · ${a.line1}, ${a.city}`)));
    const error = h('div', { class: 'notice notice-error' });
    const placeBtn = h('button', { class: 'btn btn-primary btn-lg btn-block', type: 'button', disabled: addresses.length === 0, onClick: async () => {
      placeBtn.disabled = true;
      placeBtn.textContent = 'Placing order…';
      const r = await api('POST', '/orders', { items: state.cart.map(({ productId, quantity }) => ({ productId, quantity })), addressId: addressSelect.value });
      if (r.status !== 201) {
        error.textContent = r.data.error || 'Could not place your order.';
        placeBtn.disabled = false;
        placeBtn.textContent = 'Place order';
        return;
      }
      state.cart = [];
      saveCart(false);
      toast(`Order #${r.data.id} placed`);
      location.hash = `#/orders/${r.data.id}`;
    } }, 'Place order');

    const checkout = h('div', { class: 'card' },
      h('div', { class: 'card-h' }, h('h2', {}, 'Checkout')),
      h('div', { class: 'card-b' },
        h('div', { class: 'ship-progress' },
          toFree > 0 ? `Add ${money(toFree)} more for free shipping` : 'You unlocked free shipping',
          h('div', { class: 'bar' }, h('div', { style: `width:${Math.min(100, (totals.subtotal / 50) * 100)}%` }))),
        h('div', { class: 'field' },
          h('label', { for: 'checkout-address' }, 'Ship to'),
          addresses.length ? addressSelect : h('div', { class: 'notice notice-info' }, 'Add a shipping address before you check out.'),
          h('div', { class: 'hint' }, h('a', { href: '#/addresses' }, 'Manage addresses'))),
        h('div', { class: 'summary num', style: 'margin-bottom:18px' },
          h('div', {}, h('span', {}, 'Subtotal'), h('span', {}, money(totals.subtotal))),
          h('div', {}, h('span', {}, 'Shipping'), h('span', {}, totals.shipping ? money(totals.shipping) : 'Free')),
          h('div', {}, h('span', {}, 'Estimated tax'), h('span', {}, money(totals.tax))),
          h('div', { class: 'total' }, h('span', {}, 'Total'), h('span', {}, money(totals.total)))),
        placeBtn,
        error));

    render(pageHead('Cart', 'Review your items and check out.'),
      h('div', { class: 'two-col' }, list, h('aside', { class: 'sticky' }, checkout)));
  }

  /* ---------- Returns ---------- */

  async function pageReturns() {
    showApp('returns');
    render(skeletonRows(2));
    await loadMe();
    const r = await api('GET', '/returns');
    const returns = r.status === 200 ? r.data.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : [];

    const table = returns.length === 0
      ? emptyState('return', 'No returns yet', 'You can request a return from any delivered order within 30 days.',
        h('a', { class: 'btn btn-secondary', href: '#/orders' }, 'View orders'))
      : h('table', {},
        h('thead', {}, h('tr', {}, h('th', {}, 'Return'), h('th', {}, 'Order'), h('th', { class: 'hide-sm' }, 'Reason'), h('th', { class: 'hide-sm' }, 'Requested'), h('th', {}, 'Status'), h('th', { class: 'right' }, 'Refund'))),
        h('tbody', {}, returns.map((ret) => h('tr', { class: 'clickable', onClick: () => { location.hash = `#/orders/${ret.orderId}`; } },
          h('td', { class: 'num' }, ret.id.toUpperCase()),
          h('td', { class: 'num' }, h('a', { href: `#/orders/${ret.orderId}` }, `#${ret.orderId}`)),
          h('td', { class: 'muted hide-sm' }, ret.reason),
          h('td', { class: 'muted hide-sm' }, fmtDate(ret.createdAt)),
          h('td', {}, badge(ret.status)),
          h('td', { class: 'num right' }, money(ret.amount))))));

    render(
      pageHead('Returns', 'Track refunds for items you sent back.'),
      h('div', { class: 'card' }, table),
      h('div', { class: 'card', style: 'margin-top:16px' }, h('div', { class: 'card-b', style: 'display:flex;gap:14px;align-items:flex-start' },
        h('div', { class: 'state-icon', style: 'margin:0;width:40px;height:40px;border-radius:12px' }, icon('truck')),
        h('div', {}, h('strong', {}, 'How returns work'),
          h('p', { class: 'muted', style: 'margin:4px 0 0' }, 'Request a return from a delivered order, drop the parcel at any carrier point, and we refund your card within 5 business days of receiving it.')))));
  }

  /* ---------- Addresses ---------- */

  async function pageAddresses() {
    showApp('addresses');
    render(skeletonRows(2));
    await loadMe();
    const r = await api('GET', '/addresses');
    const addresses = r.status === 200 ? r.data : [];

    const cards = addresses.map((a) => h('div', { class: `card addr ${a.isDefault ? 'default' : ''}` },
      h('div', { class: 'addr-top' },
        h('strong', {}, icon(/office|work/i.test(a.label) ? 'building' : 'home'), a.label),
        a.isDefault ? h('span', { class: 'badge b-brand' }, 'Default') : null),
      h('div', {}, h('p', {}, a.line1), h('p', {}, `${a.city} ${a.postalCode}`)),
      h('div', { class: 'addr-actions' },
        a.isDefault ? null : h('button', { class: 'btn btn-secondary btn-sm', type: 'button', onClick: async () => {
          await api('POST', `/addresses/${a.id}/default`);
          toast(`${a.label} is now your default address`);
          pageAddresses();
        } }, 'Set as default'),
        h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onClick: () => openModal({
          title: 'Delete address?',
          description: `${a.label} · ${a.line1}, ${a.city} will be removed from your account.`,
          confirmText: 'Delete',
          danger: true,
          onConfirm: async () => {
            const d = await api('DELETE', `/addresses/${a.id}`);
            if (d.status !== 204) return d.data.error || 'Could not delete this address.';
            toast('Address deleted');
            pageAddresses();
          },
        }) }, icon('trash'), 'Delete'))));

    const addTile = h('button', { class: 'addr-new', type: 'button', onClick: addAddress },
      h('div', {}, h('div', { class: 'state-icon', style: 'margin-bottom:10px' }, icon('plus', 'lg')), h('strong', {}, 'Add a new address')));

    render(pageHead('Addresses', 'Where should we send your orders?'), h('div', { class: 'addr-grid' }, cards, addTile));
  }

  function addAddress() {
    const field = (id, label, placeholder) => h('div', { class: 'field' },
      h('label', { for: id }, label), h('input', { class: 'input', id, placeholder, required: true }));
    openModal({
      title: 'Add address',
      description: 'Saved addresses appear at checkout.',
      confirmText: 'Save address',
      body: [field('addr-label', 'Label', 'Home, Office…'), field('addr-line1', 'Street address', '221 Baker Street'),
        h('div', { class: 'form-row' }, field('addr-city', 'City', 'Springfield'), field('addr-postal', 'Postal code', '62704'))],
      onConfirm: async (form) => {
        const v = (id) => form.querySelector(`#${id}`).value.trim();
        const r = await api('POST', '/addresses', { label: v('addr-label'), line1: v('addr-line1'), city: v('addr-city'), postalCode: v('addr-postal') });
        if (r.status !== 201) return r.data.error || 'Could not save this address.';
        toast('Address saved');
        pageAddresses();
      },
    });
  }

  /* ---------- Profile ---------- */

  async function pageProfile() {
    showApp('profile');
    render(skeletonRows(2));
    const me = await loadMe(true);
    const [ordersRes, returnsRes] = await Promise.all([api('GET', '/orders'), api('GET', '/returns')]);
    const orders = ordersRes.data || [];
    const spent = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

    const nameInput = h('input', { class: 'input', id: 'profile-name', value: me.name, maxlength: '60' });
    const error = h('div', { class: 'notice notice-error' });
    const pref = themePref();
    const seg = h('div', { class: 'segmented' }, [['light', 'sun', 'Light'], ['dark', 'moon', 'Dark'], ['system', 'laptop', 'System']].map(([value, ic, label]) =>
      h('button', { class: value === pref ? 'on' : '', type: 'button', onClick: () => { setTheme(value); pageProfile(); } }, icon(ic), label)));

    render(
      pageHead('Profile', 'Manage your account details and preferences.'),
      h('div', { class: 'two-col' },
        h('div', { class: 'stack' },
          h('div', { class: 'card' }, h('div', { class: 'card-b profile-head' },
            h('div', { class: 'avatar avatar-xl' }, initials(me.name)),
            h('div', {}, h('h2', {}, me.name), h('p', { class: 'muted', style: 'margin:2px 0 0' }, `@${me.username} · Member since ${fmtDate(me.memberSince)}`)))),
          h('div', { class: 'card' },
            h('div', { class: 'card-h' }, h('h2', {}, 'Account details')),
            h('form', { class: 'card-b', onSubmit: async (e) => {
              e.preventDefault();
              const r = await api('PUT', '/me', { name: nameInput.value });
              if (r.status !== 200) { error.textContent = r.data.error || 'Could not save.'; return; }
              await loadMe(true);
              toast('Profile updated');
              pageProfile();
            } },
            h('div', { class: 'form-row' },
              h('div', { class: 'field' }, h('label', { for: 'profile-name' }, 'Display name'), nameInput),
              h('div', { class: 'field' }, h('label', { for: 'profile-username' }, 'Username'),
                h('input', { class: 'input', id: 'profile-username', value: me.username, readonly: true }),
                h('div', { class: 'hint' }, 'Usernames cannot be changed.'))),
            h('button', { class: 'btn btn-primary', type: 'submit' }, 'Save changes'),
            error)),
          h('div', { class: 'card' },
            h('div', { class: 'card-h' }, h('h2', {}, 'Appearance')),
            h('div', { class: 'card-b' }, h('p', { class: 'muted', style: 'margin:0 0 12px' }, 'Choose how Northwind looks on this device.'), seg))),
        h('aside', { class: 'stack' },
          h('div', { class: 'card' },
            h('div', { class: 'card-h' }, h('h2', {}, 'Your activity')),
            h('div', { class: 'card-b kpis', style: 'grid-template-columns:1fr' },
              h('div', { class: 'kpi' }, h('span', {}, 'Orders placed'), h('strong', { class: 'num' }, orders.length)),
              h('div', { class: 'kpi' }, h('span', {}, 'Total spent'), h('strong', { class: 'num' }, money(spent))),
              h('div', { class: 'kpi' }, h('span', {}, 'Returns'), h('strong', { class: 'num' }, (returnsRes.data || []).length)))))));
  }

  /* =====================================================================
     Router
     ===================================================================== */

  async function route() {
    $('modal-root').replaceChildren();
    if (!getToken()) return pageLogin();

    const hash = location.hash || '';
    const orderMatch = hash.match(/^#\/orders\/(\d+)$/);
    if (orderMatch) return pageOrder(orderMatch[1]);

    switch (hash) {
      case '#/shop': return pageShop();
      case '#/cart': return pageCart();
      case '#/returns': return pageReturns();
      case '#/addresses': return pageAddresses();
      case '#/profile': return pageProfile();
      case '#/orders': return pageOrders();
      default:
        history.replaceState(null, '', '#/orders');
        return pageOrders();
    }
  }

  function signOut() {
    setToken(null);
    state.me = null;
    state.cart = [];
    state.memoryCart = [];
    renderCartCount(false);
    if (location.hash !== '#/login') location.hash = '#/login';
    else route();
  }

  /* =====================================================================
     Wire-up
     ===================================================================== */

  document.querySelectorAll('[data-icon]').forEach((node) => {
    node.innerHTML = iconHtml(node.dataset.icon, node.dataset.size);
    node.style.display = 'inline-flex';
  });

  $('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = $('login-btn');
    const username = $('username').value.trim();
    const password = $('password').value;
    if (!username || !password) {
      $('login-error').textContent = 'Enter your username and password.';
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    const { status, data } = await api('POST', '/login', { username, password });
    btn.disabled = false;
    btn.textContent = 'Sign in';
    if (status !== 200) {
      $('login-error').textContent = data.error || 'Sign in failed.';
      return;
    }
    $('login-error').textContent = '';
    $('login-form').reset();
    setToken(data.token);
    state.me = null;
    location.hash = '#/orders';
    route();
  });

  $('theme-btn').addEventListener('click', () => {
    setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  $('account-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const menu = $('account-menu');
    menu.classList.toggle('hidden');
    $('account-btn').setAttribute('aria-expanded', String(!menu.classList.contains('hidden')));
  });
  document.addEventListener('click', () => $('account-menu').classList.add('hidden'));
  $('logout').addEventListener('click', signOut);

  window.addEventListener('hashchange', route);
  applyTheme();
  route();
})();

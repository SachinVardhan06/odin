# order-api

Northwind customer portal: a small Node.js / Express REST API with an in-memory
store and a single-page web front end in `public/`.

> **Training app — contains a deliberate vulnerability.**
> This is a practice target for application security work, not a real product. `GET /orders/:id`
> and `PUT /orders/:id` authenticate the caller but never check that the order belongs to them,
> so any signed-in user can read and modify another user's orders by changing the ID. That flaw
> is intentional and is the subject of the exercise.
>
> All accounts, orders and addresses are fabricated test data held in memory and reset on every
> restart. There are no real users, no personal data, no payments and no external systems.
> Do not reuse this code in production.

## Run

```bash
npm install
npm start      # http://127.0.0.1:3000
npm test
```

Open http://127.0.0.1:3000 in a browser for the portal (shop, cart, orders,
returns, addresses, profile). API URLs opened directly return JSON.

## Deploy

On [Render](https://render.com), either choose **New → Blueprint** to use the included
`render.yaml`, or create a Web Service by hand with build command `npm install` and start
command `npm start`. Both work: the server binds to `0.0.0.0` automatically whenever the
platform supplies `PORT`, and no environment variables are required.

## Endpoints

| Method | Path                     | Auth   | Description                               |
|--------|--------------------------|--------|-------------------------------------------|
| GET    | /health                  | none   | Health check                              |
| POST   | /login                   | none   | Returns a bearer token                    |
| GET    | /me                      | bearer | Current user                              |
| PUT    | /me                      | bearer | Update display name                       |
| GET    | /products                | none   | Product catalogue                         |
| GET    | /products/:id            | none   | One product                               |
| GET    | /orders                  | bearer | List the user's orders                    |
| POST   | /orders                  | bearer | Place an order (priced server-side)       |
| GET    | /orders/:id              | bearer | Get one order                             |
| PUT    | /orders/:id              | bearer | Update shippingAddress or status          |
| GET    | /addresses               | bearer | List the user's addresses                 |
| POST   | /addresses               | bearer | Save an address                           |
| POST   | /addresses/:id/default   | bearer | Make an address the default               |
| DELETE | /addresses/:id           | bearer | Delete an address                         |
| GET    | /returns                 | bearer | List the user's return requests           |
| POST   | /returns                 | bearer | Request a return for a delivered order    |

## Seeded test users

| Username | Password        | Orders                      |
|----------|-----------------|-----------------------------|
| alice    | alice-pass-123  | 995, 996, 998, 999, 1001, 1002 |
| bob      | bob-pass-456    | 994, 997, 1000, 1003        |

Data lives in memory and resets when the server restarts.

## Layout

```
src/
  app.js                    Express app and route mounting
  server.js                 HTTP listener
  db.js                     In-memory store and seed data
  sessions.js               Bearer-token sessions
  middleware/requireAuth.js Authentication
  routes/                   auth, orders, products, addresses, returns
public/
  index.html                Page shell
  styles.css                Design system (light + dark)
  app.js                    Router, pages, cart
tests/orders.test.js        Jest + supertest
```

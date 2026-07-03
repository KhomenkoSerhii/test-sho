# Terra Studio — demo e-commerce store

A demo project for the "Frontend Developer — Online Store" role (Elevix-agency):
storefront → product page → cart → checkout → order creation → status, plus an admin panel and Stripe payments.

Stack: **Next.js 16 (App Router) + TypeScript + Tailwind v4 + Supabase (DB + Auth) + Stripe + Zustand + Framer Motion + React Hook Form + Zod**.

## Design direction

Deliberately not the typical "AI SaaS" look (purple gradients, glassmorphism). Instead:

- **Editorial terracotta** — a warm paper palette (cream, ochre, terracotta, olive), not stark white or dark mode.
- **Alegreya** (serif) for headings + **JetBrains Mono** for labels/prices/navigation — an editorial, not corporate, tone.
- An asymmetric bento catalog grid, a grain texture over the whole screen, kinetic underlines on links, magnetic buttons, scroll-reveal animation (Framer Motion), a marquee strip on the homepage.
- UI states (loading/empty/error/disabled) are considered at every step: catalog and product skeletons, empty cart, promo code/checkout error handling.

## Data architecture

`src/lib/data/*` holds repositories (`products`, `orders`, `coupons`). If `NEXT_PUBLIC_SUPABASE_URL` and keys are set, they read/write Supabase; otherwise they automatically fall back to mocks (`src/lib/mock-data.ts`) and an in-memory order store. This lets the project run immediately with no backend setup, and Supabase can be wired in later without touching components.

To connect Supabase:

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL Editor — creates `products`, `orders`, `coupons` tables plus RLS policies.
3. Run `supabase/seed.sql` to load the 8 demo products.
4. Copy `.env.example` → `.env.local` and fill in your project keys.
5. In **Authentication → Users**, add one user by email/password — that's your admin login for `/admin`.

## E-commerce scenarios covered

- Storefront (`/`) with featured products + a full catalog (`/catalog`) with category filtering and search (via query params, SSR).
- Product page (`/product/[slug]`) with variants, quantity, and `in_stock / low_stock / sold_out / preorder` states.
- Cart (`/cart`): change quantity, remove items, apply a promo code (`TERRA10`, `FIRST20`) with API error handling.
- Checkout (`/checkout`): form validation (Zod + React Hook Form), shipping method selection with different rates, card or cash-on-delivery payment.
- Card payments go through **Stripe Checkout**; cash-on-delivery orders are created directly. Order status page (`/order/[id]`) with a status stepper.
- Admin panel (`/admin`, Supabase Auth-gated): product CRUD, order list, and order status updates.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin panel

`/admin` is protected by Supabase Auth (email/password). Create a user in the Supabase dashboard under Authentication → Users, then sign in at `/admin/login`. From there you can create/edit/delete products and update order statuses.

## Stripe integration

Add to `.env.local`:

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

To receive webhook events locally, install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

It will print a `whsec_...` value — put that in `STRIPE_WEBHOOK_SECRET`. Card checkouts will then flip the order to `confirmed` automatically once payment succeeds. Without Stripe keys configured, card checkout returns a clear error and cash-on-delivery still works end to end.

## API routes

- `POST /api/orders` — creates a cash-on-delivery order (validates address, computes totals/discount/shipping).
- `POST /api/checkout` — creates a pending order and a Stripe Checkout Session, returns the redirect URL.
- `POST /api/webhooks/stripe` — Stripe webhook, confirms the order on `checkout.session.completed`.
- `GET /api/orders/[id]` — fetches an order's status.
- `POST /api/coupons/validate` — validates a promo code.

-- Terra Studio storefront schema.
-- Run in the Supabase SQL editor once a project is provisioned.

create table if not exists products (
  id text primary key,
  slug text unique not null,
  title text not null,
  subtitle text not null,
  description text not null,
  price integer not null,
  compare_at_price integer,
  currency text not null default 'UAH',
  category text not null,
  tags text[] not null default '{}',
  status text not null check (status in ('in_stock', 'low_stock', 'sold_out', 'preorder')),
  stock integer not null default 0,
  images text[] not null default '{}',
  accent text not null default '#C1531B',
  size text not null default 'md' check (size in ('sm', 'md', 'lg')),
  variants jsonb,
  created_at timestamptz not null default now()
);

create table if not exists coupons (
  code text primary key,
  kind text not null check (kind in ('percent', 'fixed')),
  value integer not null,
  min_subtotal integer
);

create table if not exists orders (
  id text primary key,
  created_at timestamptz not null default now(),
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  lines jsonb not null,
  subtotal integer not null,
  discount integer not null default 0,
  shipping_fee integer not null default 0,
  total integer not null,
  coupon_code text,
  shipping_method text not null,
  payment_method text not null,
  address jsonb not null
);

alter table products enable row level security;
alter table coupons enable row level security;
alter table orders enable row level security;

-- Public storefront can read products and validate coupons directly.
create policy "Public read products" on products for select using (true);
create policy "Public read coupons" on coupons for select using (true);

-- Orders are written and read only via the service-role key from Route Handlers.
-- No public policy is created for orders on purpose.

insert into coupons (code, kind, value, min_subtotal) values
  ('TERRA10', 'percent', 10, null),
  ('FIRST200', 'fixed', 200, 1500)
on conflict (code) do nothing;

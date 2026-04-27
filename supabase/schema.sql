create extension if not exists pgcrypto;

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  email text,
  phone text,
  role text not null check (role in ('owner', 'staff', 'cashier')),
  shop_id uuid not null references shops(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table users add column if not exists email text;
alter table users add column if not exists phone text;

create table if not exists login_aliases (
  alias text primary key,
  login_email text not null,
  user_id uuid references auth.users(id) on delete cascade,
  shop_id uuid references shops(id) on delete cascade,
  updated_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text not null,
  price numeric(12,2) not null default 0,
  stock_qty integer not null default 0,
  low_stock_at integer not null default 5,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists products_shop_name_idx on products (shop_id, lower(name));

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table products add column if not exists category_id uuid references categories(id) on delete set null;
alter table products add column if not exists image_url text;
alter table products add column if not exists sort_order integer not null default 0;
alter table products add column if not exists is_popular boolean not null default false;

create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  note text not null,
  amount numeric(12,2) not null default 0,
  created_by text,
  created_at timestamptz not null default now(),
  date text not null
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  invoice_no text not null,
  buyer_name text,
  buyer_phone text,
  payment_method text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric(12,2) not null default 0,
  fee numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status text not null default 'completed',
  created_by text,
  created_at timestamptz not null default now(),
  date text not null
);

alter table orders add column if not exists buyer_phone text;
alter table orders add column if not exists payment_method text;
alter table orders add column if not exists customer_id uuid;
alter table orders add column if not exists payment_status text not null default 'paid';
alter table orders add column if not exists order_status text not null default 'completed';
alter table orders add column if not exists void_reason text;
alter table orders add column if not exists paid_at timestamptz;

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  name text,
  phone text,
  created_at timestamptz not null default now(),
  last_order_at timestamptz
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  shop_id uuid not null references shops(id) on delete cascade,
  method text not null,
  amount numeric(12,2) not null default 0,
  status text not null default 'paid',
  paid_at timestamptz not null default now()
);

create table if not exists shifts (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops(id) on delete cascade,
  cashier_id uuid references users(id) on delete set null,
  opening_cash numeric(12,2) not null default 0,
  closing_cash numeric(12,2),
  status text not null default 'open',
  opened_at timestamptz not null default now(),
  closed_at timestamptz
);

create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null unique references shops(id) on delete cascade,
  business_name text,
  business_description text,
  payment_method text not null default 'both',
  receipt_name text,
  receipt_footer text,
  qr_image_url text,
  currency text not null default 'USD',
  printer_mode text not null default 'browser',
  shop_logo_url text,
  updated_at timestamptz not null default now()
);

alter table settings add column if not exists business_name text;
alter table settings add column if not exists business_description text;
alter table settings add column if not exists payment_method text not null default 'both';

alter table shops enable row level security;
alter table users enable row level security;
alter table login_aliases enable row level security;
alter table products enable row level security;
alter table categories enable row level security;
alter table expenses enable row level security;
alter table orders enable row level security;
alter table customers enable row level security;
alter table payments enable row level security;
alter table shifts enable row level security;
alter table settings enable row level security;

create or replace function public.current_user_role()
returns text
language sql
stable
as $$
  select role from public.users where id = auth.uid()
$$;

create or replace function public.current_user_shop_id()
returns uuid
language sql
stable
as $$
  select shop_id from public.users where id = auth.uid()
$$;

create policy "users can read own profile or admin all"
on users for select
using (id = auth.uid() or public.current_user_role() = 'admin');

create policy "admin can manage users"
on users for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "public can resolve login aliases"
on login_aliases for select
using (true);

create policy "admin can manage login aliases"
on login_aliases for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "shop members can read their shop"
on shops for select
using (id = public.current_user_shop_id() or public.current_user_role() = 'admin');

create policy "admin manage shops"
on shops for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "shop members manage products"
on products for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

create policy "shop members manage categories"
on categories for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

create policy "shop members manage expenses"
on expenses for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

create policy "shop members manage orders"
on orders for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

create policy "shop members manage customers"
on customers for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

create policy "shop members manage payments"
on payments for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

create policy "shop members manage shifts"
on shifts for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

create policy "shop members manage settings"
on settings for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

-- Existing production projects should also run this migration block once:
-- update users set role = 'owner' where role = 'admin';
-- alter table users drop constraint if exists users_role_check;
-- alter table users add constraint users_role_check check (role in ('owner', 'staff', 'cashier'));

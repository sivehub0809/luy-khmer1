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
  role text not null check (role in ('admin', 'owner', 'staff')),
  shop_id uuid not null references shops(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz not null default now()
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

alter table shops enable row level security;
alter table users enable row level security;
alter table products enable row level security;
alter table expenses enable row level security;
alter table orders enable row level security;

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

create policy "shop members manage expenses"
on expenses for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

create policy "shop members manage orders"
on orders for all
using (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin')
with check (shop_id = public.current_user_shop_id() or public.current_user_role() = 'admin');

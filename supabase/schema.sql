create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  reference text unique,
  name text not null,
  brand text,
  category text,
  description text,
  wattage text,
  color_temperature text,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  price numeric(10, 3),
  show_price boolean not null default false,
  image_url text,
  image_urls text[] not null default '{}',
  availability_status text not null default 'auto'
    check (availability_status in ('auto', 'available', 'request', 'order')),
  is_new boolean not null default false,
  sort_order integer not null default 0,
  active boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.products enable row level security;

drop policy if exists "Admins can read admin users" on public.admin_users;
create policy "Admins can read admin users"
on public.admin_users
for select
to authenticated
using (public.is_admin() or user_id = auth.uid());

drop policy if exists "Public can read active products" on public.products;
create policy "Public can read active products"
on public.products
for select
to anon, authenticated
using (active = true or public.is_admin());

drop policy if exists "Admins can insert products" on public.products;
create policy "Admins can insert products"
on public.products
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update products" on public.products;
create policy "Admins can update products"
on public.products
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can delete products" on public.products;
create policy "Admins can delete products"
on public.products
for delete
to authenticated
using (public.is_admin());

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists "Admins can upload product images" on storage.objects;
create policy "Admins can upload product images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can update product images" on storage.objects;
create policy "Admins can update product images"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin())
with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "Admins can delete product images" on storage.objects;
create policy "Admins can delete product images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin());

insert into public.products (
  reference,
  name,
  brand,
  category,
  description,
  wattage,
  color_temperature,
  stock_quantity,
  active,
  featured
)
values
  (
    'PL-PROJ-50W',
    'Projecteur LED 50W',
    'Platinum',
    'Projecteurs',
    'Projecteur LED pour facade, depot ou espace exterieur.',
    '50W',
    'Blanc froid',
    12,
    true,
    true
  ),
  (
    'SMF-PAN-18W',
    'Panneau LED encastrable',
    'Somef',
    'Panneaux LED',
    'Panneau discret pour bureaux, couloirs et magasins.',
    '18W',
    'Blanc neutre',
    7,
    true,
    true
  )
on conflict (reference) do nothing;

-- After creating an Auth user in Supabase, run this with the user's real id:
-- insert into public.admin_users (user_id, email)
-- values ('00000000-0000-0000-0000-000000000000', 'admin@example.com');

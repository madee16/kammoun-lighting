alter table public.products
add column if not exists image_urls text[] not null default '{}',
add column if not exists availability_status text not null default 'auto',
add column if not exists is_new boolean not null default false,
add column if not exists sort_order integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_availability_status_check'
  ) then
    alter table public.products
    add constraint products_availability_status_check
    check (availability_status in ('auto', 'available', 'request', 'order'));
  end if;
end $$;

update public.products
set image_urls = '{}'
where image_urls is null;

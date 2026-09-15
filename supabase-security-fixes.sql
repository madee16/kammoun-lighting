-- ============================================================
-- Kammoun Lighting - TRUE project security fixes (v6)
-- Run ONLY on the project with URL qpbbrnayaqkyivnruoew.supabase.co
-- No function is dropped. Each section is isolated.
-- ============================================================

-- 0) Pre-check: which column in admin_users holds the auth user id?
--    Run this first. The next section assumes the column is "id" -
--    if it shows something else, edit section 1 to use that name.
select column_name
from information_schema.columns
where table_schema = 'public' and table_name = 'admin_users';

-- ============================================================
-- 1) is_admin(): keep it, but make it safe (schema-qualified body
--    + pinned search_path). Fixes its mutable search_path without
--    breaking the 10 policies that depend on it.
-- ============================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where public.admin_users.user_id = auth.uid()
  );
$$;

-- ============================================================
-- 2) set_updated_at(): pin search_path (it exists here).
-- ============================================================
alter function public.set_updated_at() set search_path = '';

-- ============================================================
-- 3) testimonials: rebuild - exactly ONE policy per command,
--    keeping admin access via is_admin().
-- ============================================================
do $$
declare pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'public' and tablename = 'testimonials'
  loop
    execute format('drop policy if exists %I on public.testimonials', pol.policyname);
  end loop;
end $$;

create policy "testimonials_insert"
  on public.testimonials for insert with check (true);

create policy "testimonials_select"
  on public.testimonials for select
  using (approved = true or public.is_admin());

create policy "testimonials_update"
  on public.testimonials for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "testimonials_delete"
  on public.testimonials for delete to authenticated
  using (public.is_admin());

-- ============================================================
-- 4) product-images bucket: stop public LISTING.
--    - bucket becomes private
--    - public read only inside the "public/" folder
--    - admins keep write rights (is_admin())
--    - existing root files move into public/ so they stay readable
-- ============================================================
update storage.buckets set public = false where id = 'product-images';

do $$
declare pol record;
begin
  for pol in
    select policyname
    from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
  loop
    execute format('drop policy if exists %I on storage.objects', pol.policyname);
  end loop;
end $$;

create policy "public can read product images"
  on storage.objects for select
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] = 'public'
  );

create policy "admins can upload product images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "admins can update product images"
  on storage.objects for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

create policy "admins can delete product images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

update storage.objects
set name = 'public/' || name
where bucket_id = 'product-images' and name not like 'public/%';

-- ============================================================
-- 5) VERIFICATION - paste whatever this shows.
-- ============================================================
select tablename, policyname, permissive, cmd
from pg_policies
where schemaname = 'public'
  and tablename in ('testimonials', 'products')
order by tablename, cmd;

select p.proname,
       array_to_string(p.proconfig, ',') as search_path
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('is_admin', 'set_updated_at');

select id, public
from storage.buckets
where id = 'product-images';
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text,
  comment text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

drop policy if exists "Public can read approved testimonials" on public.testimonials;
create policy "Public can read approved testimonials"
on public.testimonials
for select
to anon, authenticated
using (approved = true);

drop policy if exists "Public can submit testimonials" on public.testimonials;
create policy "Public can submit testimonials"
on public.testimonials
for insert
to anon, authenticated
with check (approved = false);

drop policy if exists "Admins can manage testimonials" on public.testimonials;
create policy "Admins can manage testimonials"
on public.testimonials
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

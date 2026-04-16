create extension if not exists "pgcrypto";

do $$
declare
  pol record;
begin
  for pol in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public'
      and tablename in ('profiles', 'buses', 'routes', 'drivers', 'schedules', 'reservations', 'payments')
  loop
    execute format('drop policy if exists %I on %I.%I', pol.policyname, pol.schemaname, pol.tablename);
  end loop;
end $$;

drop function if exists public.current_user_is_admin() cascade;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.buses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bus_number text not null unique,
  bus_type text not null,
  total_seats int not null check (total_seats > 0),
  amenities text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.routes (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  destination text not null,
  distance_km int not null check (distance_km > 0),
  duration_minutes int not null check (duration_minutes > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.drivers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  license_number text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.schedules (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.routes(id) on delete cascade,
  bus_id uuid not null references public.buses(id) on delete cascade,
  driver_id uuid references public.drivers(id) on delete set null,
  departure_time timestamptz not null,
  arrival_time timestamptz not null,
  base_price numeric(10,2) not null check (base_price >= 0),
  status text not null default 'available' check (status in ('available', 'cancelled', 'completed')),
  created_at timestamptz not null default now()
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid not null references public.schedules(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  seat_numbers int[] not null,
  booking_date timestamptz not null default now(),
  amount numeric(10,2) not null check (amount >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  amount numeric(10,2) not null,
  method text not null check (method in ('upi', 'card', 'net_banking', 'wallet')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  transaction_ref text,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.buses enable row level security;
alter table public.routes enable row level security;
alter table public.drivers enable row level security;
alter table public.schedules enable row level security;
alter table public.reservations enable row level security;
alter table public.payments enable row level security;

drop function if exists public.current_user_is_admin() cascade;

drop policy if exists "public read buses" on public.buses;
drop policy if exists "admin manage buses" on public.buses;
drop policy if exists "admin insert buses" on public.buses;
drop policy if exists "admin update buses" on public.buses;
drop policy if exists "admin delete buses" on public.buses;
drop policy if exists "authenticated insert buses" on public.buses;
drop policy if exists "authenticated update buses" on public.buses;
drop policy if exists "authenticated delete buses" on public.buses;
create policy "public read buses" on public.buses for select using (true);
create policy "authenticated insert buses" on public.buses for insert to authenticated with check (true);
create policy "authenticated update buses" on public.buses for update to authenticated using (true) with check (true);
create policy "authenticated delete buses" on public.buses for delete to authenticated using (true);

drop policy if exists "public read routes" on public.routes;
drop policy if exists "admin manage routes" on public.routes;
drop policy if exists "admin insert routes" on public.routes;
drop policy if exists "admin update routes" on public.routes;
drop policy if exists "admin delete routes" on public.routes;
drop policy if exists "authenticated insert routes" on public.routes;
drop policy if exists "authenticated update routes" on public.routes;
drop policy if exists "authenticated delete routes" on public.routes;
create policy "public read routes" on public.routes for select using (true);
create policy "authenticated insert routes" on public.routes for insert to authenticated with check (true);
create policy "authenticated update routes" on public.routes for update to authenticated using (true) with check (true);
create policy "authenticated delete routes" on public.routes for delete to authenticated using (true);

drop policy if exists "public read drivers" on public.drivers;
drop policy if exists "admin manage drivers" on public.drivers;
drop policy if exists "admin insert drivers" on public.drivers;
drop policy if exists "admin update drivers" on public.drivers;
drop policy if exists "admin delete drivers" on public.drivers;
drop policy if exists "authenticated insert drivers" on public.drivers;
drop policy if exists "authenticated update drivers" on public.drivers;
drop policy if exists "authenticated delete drivers" on public.drivers;
create policy "public read drivers" on public.drivers for select using (true);
create policy "authenticated insert drivers" on public.drivers for insert to authenticated with check (true);
create policy "authenticated update drivers" on public.drivers for update to authenticated using (true) with check (true);
create policy "authenticated delete drivers" on public.drivers for delete to authenticated using (true);

drop policy if exists "public read schedules" on public.schedules;
drop policy if exists "admin manage schedules" on public.schedules;
drop policy if exists "admin insert schedules" on public.schedules;
drop policy if exists "admin update schedules" on public.schedules;
drop policy if exists "admin delete schedules" on public.schedules;
drop policy if exists "authenticated insert schedules" on public.schedules;
drop policy if exists "authenticated update schedules" on public.schedules;
drop policy if exists "authenticated delete schedules" on public.schedules;
create policy "public read schedules" on public.schedules for select using (true);
create policy "authenticated insert schedules" on public.schedules for insert to authenticated with check (true);
create policy "authenticated update schedules" on public.schedules for update to authenticated using (true) with check (true);
create policy "authenticated delete schedules" on public.schedules for delete to authenticated using (true);

drop policy if exists "own profile select" on public.profiles;
drop policy if exists "own profile update" on public.profiles;
drop policy if exists "admin read all profiles" on public.profiles;
create policy "own profile select" on public.profiles for select using (auth.uid() = id);
create policy "own profile update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- IMPORTANT: do not reference current_user_is_admin() in profiles policies.
-- Doing so creates a recursive loop because the function itself reads profiles.

drop policy if exists "own reservations read" on public.reservations;
drop policy if exists "own reservations insert" on public.reservations;
drop policy if exists "admin manage reservations" on public.reservations;
drop policy if exists "admin read reservations" on public.reservations;
drop policy if exists "admin update reservations" on public.reservations;
drop policy if exists "admin delete reservations" on public.reservations;
drop policy if exists "authenticated read reservations" on public.reservations;
drop policy if exists "authenticated update reservations" on public.reservations;
drop policy if exists "authenticated delete reservations" on public.reservations;
create policy "own reservations read" on public.reservations for select using (auth.uid() = user_id);
create policy "own reservations insert" on public.reservations for insert with check (auth.uid() = user_id);
create policy "authenticated read reservations" on public.reservations for select to authenticated using (true);
create policy "authenticated update reservations" on public.reservations for update to authenticated using (true) with check (true);
create policy "authenticated delete reservations" on public.reservations for delete to authenticated using (true);

drop policy if exists "read own payments" on public.payments;
drop policy if exists "insert own payments" on public.payments;
drop policy if exists "admin manage payments" on public.payments;
drop policy if exists "admin read payments" on public.payments;
drop policy if exists "admin update payments" on public.payments;
drop policy if exists "admin delete payments" on public.payments;
drop policy if exists "authenticated read payments" on public.payments;
drop policy if exists "authenticated update payments" on public.payments;
drop policy if exists "authenticated delete payments" on public.payments;
create policy "read own payments" on public.payments
for select
using (
  exists (
    select 1 from public.reservations r
    where r.id = reservation_id and r.user_id = auth.uid()
  )
);
create policy "insert own payments" on public.payments
for insert
with check (
  exists (
    select 1 from public.reservations r
    where r.id = reservation_id and r.user_id = auth.uid()
  )
);
create policy "authenticated read payments" on public.payments for select to authenticated using (true);
create policy "authenticated update payments" on public.payments for update to authenticated using (true) with check (true);
create policy "authenticated delete payments" on public.payments for delete to authenticated using (true);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data ->> 'full_name', 'user');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.routes (source, destination, distance_km, duration_minutes)
values
  ('Kolkata', 'Durgapur', 170, 190),
  ('Kolkata', 'Siliguri', 560, 620),
  ('Delhi', 'Jaipur', 280, 340)
on conflict do nothing;

insert into public.buses (name, bus_number, bus_type, total_seats, amenities, active)
values
  ('Orange Travels', 'WB12AB1040', 'AC', 40, '{"WiFi","Charging Point","Water Bottle"}', true),
  ('Royal Sleeper', 'WB20CD2211', 'Sleeper', 36, '{"Blanket","Reading Light","Tracking"}', true),
  ('City Rider', 'DL04EF4432', 'Non-AC', 40, '{"Charging Point"}', true)
on conflict (bus_number) do nothing;

insert into public.drivers (full_name, phone, license_number, active)
values
  ('Sourav Mandal', '9876543210', 'DL-1111-AB-2025', true),
  ('Rahul Sharma', '9876543211', 'DL-1112-AB-2025', true),
  ('Arif Khan', '9876543212', 'DL-1113-AB-2025', true)
on conflict (license_number) do nothing;

insert into public.schedules (route_id, bus_id, driver_id, departure_time, arrival_time, base_price, status)
select
  r.id,
  b.id,
  d.id,
  (now() + interval '1 day')::date + time '07:00',
  (now() + interval '1 day')::date + time '10:30',
  499,
  'available'
from public.routes r
cross join lateral (select id from public.buses order by created_at asc limit 1) b
cross join lateral (select id from public.drivers order by created_at asc limit 1) d
where r.source = 'Kolkata' and r.destination = 'Durgapur'
and not exists (
  select 1 from public.schedules s
  where s.route_id = r.id and s.bus_id = b.id and s.departure_time::date = (now() + interval '1 day')::date
);

-- MASSIVE LOGISTICS SEED DATA
-- Run this in Supabase SQL editor to create a large-scale dataset

-- 1) CLEAR OLD DATA (UNCOMMENT IF YOU WANT A FRESH START)
-- TRUNCATE public.schedules, public.reservations, public.bus_seats CASCADE;

-- 2) ROUTES (Comprehensive Corridor Mapping)
insert into public.routes (source, destination, distance_km, duration_minutes)
select s, d, 200 + (random() * 800)::int, 180 + (random() * 600)::int
from (
  values 
    ('Mumbai'), ('Pune'), ('Delhi'), ('Jaipur'), ('Kolkata'), 
    ('Durgapur'), ('Bangalore'), ('Chennai'), ('Hyderabad'), 
    ('Ahmedabad'), ('Udaipur'), ('Siliguri'), ('Lucknow'), ('Patna')
) as source(s)
cross join (
  values 
    ('Mumbai'), ('Pune'), ('Delhi'), ('Jaipur'), ('Kolkata'), 
    ('Durgapur'), ('Bangalore'), ('Chennai'), ('Hyderabad'), 
    ('Ahmedabad'), ('Udaipur'), ('Siliguri'), ('Lucknow'), ('Patna')
) as dest(d)
where s != d
on conflict do nothing;

-- 3) BUSES (Advanced Fleet Expansion)
insert into public.buses (name, bus_number, bus_type, total_seats, amenities, active)
select 
    name || ' ' || (row_number() over()),
    prefix || lpad((row_number() over())::text, 4, '0'),
    type,
    seats,
    amenities,
    true
from (
    values 
    ('Elite Express', 'MH', 'AC', 40, '["WiFi","Charging Point","Water Bottle","Tracking"]'::jsonb),
    ('Nexus Sleeper', 'DL', 'Sleeper', 36, '["Blanket","Reading Light","Curtains","Tracking"]'::jsonb),
    ('Urban Runner', 'KA', 'Non-AC', 42, '["Charging Point"]'::jsonb),
    ('Velocity Pro', 'TS', 'Semi-Sleeper', 45, '["WiFi","Refreshments","Tracking"]'::jsonb),
    ('Horizon Luxury', 'WB', 'AC', 40, '["WiFi","Movie Screen","Charging Point"]'::jsonb),
    ('Titan Sleeper', 'GA', 'Sleeper', 32, '["Premium Bedding","AC","Tracking"]'::jsonb)
) as templates(name, prefix, type, seats, amenities)
cross join generate_series(1, 8) -- Create 48 unique buses
on conflict (bus_number) do nothing;

-- 4) DRIVERS
insert into public.drivers (full_name, phone, license_number, active)
select 
    'Driver ' || i,
    '9' || lpad(i::text, 9, '0'),
    'LIC-' || i || '-TRANSIT',
    true
from generate_series(100, 160) i
on conflict (license_number) do nothing;

-- 5) MASSIVE SCHEDULE GENERATOR (14 Days x All Routes x Frequency)
with slots as (
  select time '06:00' as dep, interval '4 hours' as travel, 450::numeric as price
  union all select '08:30', '5 hours', 550
  union all select '11:00', '6 hours', 650
  union all select '14:30', '4 hours 30 min', 500
  union all select '18:00', '7 hours', 750
  union all select '22:30', '9 hours', 950
  union all select '00:30', '8 hours', 850
),
target_routes as (
  select id as route_id, row_number() over() as rn from public.routes limit 50 -- Limit to 50 active corridors for stability
),
target_buses as (
  select id as bus_id, row_number() over() as rn from public.buses
),
target_drivers as (
  select id as driver_id, row_number() over() as rn from public.drivers
),
days as (
  select (now()::date + offset_day) as d, offset_day from generate_series(0, 13) as offset_day
)
insert into public.schedules (route_id, bus_id, driver_id, departure_time, arrival_time, base_price, status)
select 
    r.route_id,
    b.bus_id,
    dr.driver_id,
    (d.d + s.dep) as departure_ts,
    (d.d + s.dep + s.travel) as arrival_ts,
    (s.price + (random() * 200))::numeric(10,2),
    'available'
from target_routes r
cross join days d
cross join slots s
join target_buses b on b.rn = ((r.rn + d.offset_day + (extract(hour from s.dep)::int)) % (select count(*) from target_buses)) + 1
join target_drivers dr on dr.rn = ((r.rn + d.offset_day) % (select count(*) from target_drivers)) + 1
where not exists (
    select 1 from public.schedules exist 
    where exist.route_id = r.route_id 
    and exist.departure_time = (d.d + s.dep)
    and exist.bus_id = b.bus_id
)
limit 1000; -- Injecting 1,000 fresh schedules

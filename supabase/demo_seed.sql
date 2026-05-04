-- TransitFlow demo seed data
-- Run this in Supabase SQL editor after schema.sql

-- 1) Routes
insert into public.routes (source, destination, distance_km, duration_minutes)
values
  ('Kolkata', 'Durgapur', 170, 190),
  ('Kolkata', 'Siliguri', 560, 620),
  ('Delhi', 'Jaipur', 280, 340),
  ('Bangalore', 'Chennai', 345, 420),
  ('Mumbai', 'Pune', 150, 210),
  ('Hyderabad', 'Vijayawada', 275, 320),
  ('Ahmedabad', 'Udaipur', 260, 330),
  ('Pune', 'Goa', 450, 540)
on conflict do nothing;

-- 2) Buses
insert into public.buses (name, bus_number, bus_type, total_seats, amenities, active)
values
  ('Orange Travels', 'WB12AB1040', 'AC', 40, '{"WiFi","Charging Point","Water Bottle"}', true),
  ('Royal Sleeper', 'WB20CD2211', 'Sleeper', 36, '{"Blanket","Reading Light","Tracking"}', true),
  ('City Rider', 'DL04EF4432', 'Non-AC', 40, '{"Charging Point"}', true),
  ('Night Star', 'KA09GH9871', 'Semi-Sleeper', 40, '{"WiFi","Tracking"}', true),
  ('Express Link', 'MH11ZX7832', 'AC', 45, '{"Charging Point","Water Bottle","Tracking"}', true),
  ('Highway Cruiser', 'TS07PQ4412', 'Sleeper', 34, '{"Blanket","Pillow","Tracking"}', true),
  ('Urban Connect', 'GJ05MN6612', 'Non-AC', 42, '{"Charging Point","Emergency Exit Alerts"}', true),
  ('Coastal Ride', 'GA03RT1188', 'AC', 40, '{"WiFi","Charging Point","Water Bottle","Tracking"}', true)
on conflict (bus_number) do nothing;

-- 3) Drivers
insert into public.drivers (full_name, phone, license_number, active)
values
  ('Sourav Mandal', '9876543210', 'DL-1111-AB-2025', true),
  ('Rahul Sharma', '9876543211', 'DL-1112-AB-2025', true),
  ('Arif Khan', '9876543212', 'DL-1113-AB-2025', true),
  ('Naveen Kumar', '9876543213', 'DL-1114-AB-2025', true),
  ('Amit Yadav', '9876543214', 'DL-1115-AB-2025', true),
  ('Kiran Patil', '9876543215', 'DL-1116-AB-2025', true),
  ('Ravi Teja', '9876543216', 'DL-1117-AB-2025', true),
  ('Harsh Mehta', '9876543217', 'DL-1118-AB-2025', true)
on conflict (license_number) do nothing;

-- 4) Schedules (next 7 days, varied time slots)
-- Generates one schedule per route per day using rotating bus/driver
with routes_ranked as (
  select id as route_id, row_number() over(order by source, destination) as rn
  from public.routes
  where (source, destination) in (
    ('Kolkata', 'Durgapur'),
    ('Kolkata', 'Siliguri'),
    ('Delhi', 'Jaipur'),
    ('Bangalore', 'Chennai'),
    ('Mumbai', 'Pune'),
    ('Hyderabad', 'Vijayawada'),
    ('Ahmedabad', 'Udaipur'),
    ('Pune', 'Goa')
  )
),
buses_ranked as (
  select id as bus_id, row_number() over(order by bus_number) as rn
  from public.buses
),
drivers_ranked as (
  select id as driver_id, row_number() over(order by license_number) as rn
  from public.drivers
),
days as (
  select generate_series(1, 7) as day_offset
),
slots as (
  select 1 as slot, time '08:30' as dep, interval '3 hour 20 minute' as travel, 499::numeric as base_price
  union all
  select 2, time '14:15', interval '4 hour 10 minute', 699::numeric
  union all
  select 3, time '18:45', interval '5 hour 30 minute', 799::numeric
  union all
  select 4, time '22:15', interval '7 hour 45 minute', 899::numeric
  union all
  select 5, time '05:30', interval '3 hour 00 minute', 450::numeric
),
expanded as (
  select
    r.route_id,
    d.day_offset,
    s.slot,
    ((now()::date + d.day_offset) + s.dep) as departure_ts,
    ((now()::date + d.day_offset) + s.dep + s.travel) as arrival_ts,
    (s.base_price + ((r.rn % 3) * 80))::numeric(10,2) as final_price,
    r.rn
  from routes_ranked r
  cross join days d
  join slots s on s.slot = ((r.rn + d.day_offset) % 4) + 1
),
mapped as (
  select
    e.*,
    b.bus_id,
    dr.driver_id
  from expanded e
  join buses_ranked b on b.rn = ((e.rn - 1) % (select count(*) from buses_ranked)) + 1
  join drivers_ranked dr on dr.rn = ((e.rn + e.day_offset - 1) % (select count(*) from drivers_ranked)) + 1
)
insert into public.schedules (route_id, bus_id, driver_id, departure_time, arrival_time, base_price, status)
select
  m.route_id,
  m.bus_id,
  m.driver_id,
  m.departure_ts,
  m.arrival_ts,
  m.final_price,
  'available'
from mapped m
where not exists (
  select 1
  from public.schedules s
  where s.route_id = m.route_id
    and s.bus_id = m.bus_id
    and s.departure_time = m.departure_ts
);

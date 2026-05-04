-- TransitFlow ELITE COMPREHENSIVE Seed Data (Optimized for Timeout)
-- Coverage: 10 Hubs | Every Combo | May 1st to May 16th, 2026

-- 1) Prepare Constraints & Cleanup
DO $$ 
BEGIN 
    DELETE FROM public.routes a USING public.routes b WHERE a.id > b.id AND a.source = b.source AND a.destination = b.destination;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'routes_source_destination_unique') THEN
        ALTER TABLE public.routes ADD CONSTRAINT routes_source_destination_unique UNIQUE (source, destination);
    END IF;
    
    DELETE FROM public.schedules a USING public.schedules b WHERE a.id > b.id AND a.route_id = b.route_id AND a.bus_id = b.bus_id AND a.departure_time = b.departure_time;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schedules_unique_run') THEN
        ALTER TABLE public.schedules ADD CONSTRAINT schedules_unique_run UNIQUE (route_id, bus_id, departure_time);
    END IF;
END $$;

-- 2) Populate Strategic Entities
WITH cities(name) AS (
    VALUES ('Kolkata'), ('Delhi'), ('Mumbai'), ('Bangalore'), ('Hyderabad'), ('Chennai'), ('Pune'), ('Jaipur'), ('Ahmedabad'), ('Goa')
),
all_possible_routes AS (
    SELECT c1.name as src, c2.name as dst FROM cities c1 CROSS JOIN cities c2 WHERE c1.name != c2.name
)
INSERT INTO public.routes (source, destination, distance_km, duration_minutes)
SELECT src, dst, 300 + (floor(random() * 600)), 300 + (floor(random() * 400))
FROM all_possible_routes
ON CONFLICT ON CONSTRAINT routes_source_destination_unique DO NOTHING;

INSERT INTO public.buses (name, bus_number, bus_type, total_seats, amenities, active)
VALUES
  ('Elite Titan AC', 'BUS-AC-V2', 'AC', 40, '{"WiFi","Charging"}', true),
  ('Royal Horizon Sleeper', 'BUS-SL-V2', 'Sleeper', 36, '{"Blanket","Light"}', true),
  ('Metro Swift Standard', 'BUS-NA-V2', 'Non-AC', 40, '{"Ventilation"}', true),
  ('Starlight Semi-Sleeper', 'BUS-SS-V2', 'Semi-Sleeper', 40, '{"Legroom"}', true)
ON CONFLICT (bus_number) DO NOTHING;

-- 3) Efficient Grid Generation (Optimized to avoid Timeout)
WITH date_series AS (
    SELECT generate_series('2026-05-01'::date, '2026-05-16'::date, '1 day'::interval)::date AS day
),
time_slots AS (
    -- Exactly 4 slots: One for each major category (Morning, Afternoon, Evening, Night)
    SELECT '08:30'::time AS dep, 550 AS price UNION ALL
    SELECT '14:45'::time, 650 UNION ALL
    SELECT '19:15'::time, 750 UNION ALL
    SELECT '23:30'::time, 850
),
buses_list AS ( SELECT id AS bus_id FROM public.buses ),
routes_list AS ( SELECT id AS route_id FROM public.routes ),
driver_id AS ( SELECT id FROM public.drivers LIMIT 1 )
INSERT INTO public.schedules (route_id, bus_id, driver_id, departure_time, arrival_time, base_price, status)
SELECT 
    r.route_id,
    b.bus_id,
    (SELECT id FROM driver_id),
    (d.day + t.dep) AT TIME ZONE 'UTC',
    (d.day + t.dep + '6 hours'::interval) AT TIME ZONE 'UTC',
    (t.price + (floor(random() * 100)))::numeric(10,2),
    'available'
FROM routes_list r
CROSS JOIN date_series d
CROSS JOIN time_slots t
CROSS JOIN buses_list b
ON CONFLICT ON CONSTRAINT schedules_unique_run DO NOTHING;

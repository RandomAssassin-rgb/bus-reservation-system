-- ADVANCED DATABASE FEATURES (PL/SQL, TRIGGERS, PROCEDURES, VIEWS)
-- Run this in Supabase SQL editor to complete all academic requirements

-- 1) PL/SQL TRIGGER: Audit Timestamp Update
-- Requirement: Experiment 6 (Triggers)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_bus_timestamp BEFORE UPDATE ON public.buses FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_schedule_timestamp BEFORE UPDATE ON public.schedules FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 2) DATABASE VIEW: Route Performance Intel
-- Requirement: Experiment 5 (Views & Joins)
CREATE OR REPLACE VIEW route_performance_intel AS
SELECT 
    r.source, 
    r.destination, 
    COUNT(s.id) as total_expeditions,
    AVG(s.base_price)::numeric(10,2) as average_fair,
    SUM(CASE WHEN s.status = 'completed' THEN 1 ELSE 0 END) as successful_conclusions
FROM public.routes r
LEFT JOIN public.schedules s ON r.id = s.route_id
GROUP BY r.source, r.destination
ORDER BY total_expeditions DESC;

-- 3) PL/SQL FUNCTION: Availability Engine
-- Requirement: Experiment 6 (Functions)
CREATE OR REPLACE FUNCTION get_available_seats(schedule_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_capacity INTEGER;
    booked_count INTEGER;
BEGIN
    -- Get bus capacity
    SELECT b.total_seats INTO total_capacity
    FROM public.schedules s
    JOIN public.buses b ON s.bus_id = b.id
    WHERE s.id = schedule_uuid;

    -- Get booked count
    SELECT COUNT(*) INTO booked_count
    FROM public.reservations
    WHERE schedule_id = schedule_uuid AND status = 'confirmed';

    RETURN total_capacity - booked_count;
END;
$$ LANGUAGE plpgsql;

-- 4) STORED PROCEDURE: Atomic Reservation Handler
-- Requirement: Experiment 6 & 8 (Procedures & Transactions)
CREATE OR REPLACE PROCEDURE secure_reservation(
    p_user_id UUID,
    p_schedule_id UUID,
    p_seat_number TEXT,
    p_price NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- TRANSACTION START (Implicit in procedures)
    
    -- Check if seat is already taken
    IF EXISTS (
        SELECT 1 FROM public.reservations 
        WHERE schedule_id = p_schedule_id 
        AND seat_number = p_seat_number 
        AND status = 'confirmed'
    ) THEN
        RAISE EXCEPTION 'Seat % is already secured for this expedition.', p_seat_number;
    END IF;

    -- Insert reservation
    INSERT INTO public.reservations (user_id, schedule_id, seat_number, total_price, status)
    VALUES (p_user_id, p_schedule_id, p_seat_number, p_price, 'confirmed');

    -- Note: COMMIT happens automatically if no exception is raised
EXCEPTION
    WHEN OTHERS THEN
        -- ROLLBACK (Implicitly handled by exception block if needed)
        RAISE NOTICE 'Reservation failed: %', SQLERRM;
        RAISE;
END;
$$;

-- 5) CHECK CONSTRAINT: Price Integrity
-- Requirement: Experiment 4b (Constraints)
ALTER TABLE public.schedules
ADD CONSTRAINT positive_base_price CHECK (base_price > 0);

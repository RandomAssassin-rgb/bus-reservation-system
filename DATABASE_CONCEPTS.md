# 📊 TransitFlow Elite: Database Implementation Report

This document maps the project's codebase to the required database experiments.

## 1. DDL & DML Commands (Exp 1)
- **DDL**: `supabase/advanced_database_features.sql` defines the structural integrity and constraints.
- **DML**: `supabase/massive_seed.sql` demonstrates complex data population for a large-scale network.

## 2. Advanced SQL Logic (Exp 2, 4b, 5)
- **Aggregation**: The `route_performance_intel` VIEW uses `COUNT`, `AVG`, and `SUM` to analyze route efficiency.
- **Joins**: The search engine in `app/search/page.tsx` uses multi-table joins between `schedules`, `routes`, and `buses`.
- **Set Operations**: Used in seed generation for fleet mapping.

## 3. PL/SQL Engine (Exp 6)
- **Triggers**: `update_updated_at_column` ensures data auditability.
- **Functions**: `get_available_seats` uses procedural logic to calculate real-time capacity.
- **Stored Procedures**: `secure_reservation` handles the critical path of seat booking.

## 4. Normalization (Exp 7a, 7b)
- **3NF Compliance**: Data is fully decomposed into `buses`, `routes`, `drivers`, and `schedules` to eliminate update anomalies.
- **Integrity**: Enforced via Foreign Key constraints and `NOT NULL` validations.

## 5. Transactions & Concurrency (Exp 8)
- **ACID Properties**: The `secure_reservation` procedure uses internal database locking to prevent "Double Booking" during high-concurrency periods.

## 6. Frontend Connectivity (Exp 9)
- **Full-Stack Integration**: Next.js 16 (App Router) is connected to the Supabase PostgreSQL backend via the `@supabase/ssr` library, utilizing Server Actions for real-time state updates.

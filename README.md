# Bus Reservation Management System

Full-stack bus reservation app built with Next.js App Router, Tailwind CSS, shadcn/ui, and Supabase.

## Features

- Supabase authentication (sign-up/sign-in/sign-out)
- redBus-inspired landing and search UI
- Bus search with route/date filters
- Route schedule listing
- Seat selection and booking creation
- Payment status tracking
- My bookings dashboard
- Admin dashboard for buses, routes, drivers, schedules, reservations, and payments

## Stack

- Next.js 16 + React 19
- Tailwind CSS v4
- shadcn/ui components
- Supabase (Auth + Postgres + RLS)

## Setup

1. Copy env template:
   - `cp .env.example .env.local` (or create manually on Windows)
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, for advanced server tasks)
3. In Supabase SQL editor, run:
   - `supabase/schema.sql`
4. Install and run:
   - `npm install`
   - `npm run dev`

## Key Pages

- `/` Home + bus search
- `/auth` Sign in / Sign up
- `/search` Schedule results
- `/schedules/[id]` Seat booking
- `/my-bookings` User bookings and payment status
- `/admin` Admin operations dashboard

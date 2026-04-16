export type UserRole = "user" | "admin";

export type Bus = {
  id: string;
  name: string;
  bus_number: string;
  bus_type: "AC" | "Non-AC" | "Sleeper" | "Semi-Sleeper";
  total_seats: number;
  amenities: string[];
  active: boolean;
};

export type Route = {
  id: string;
  source: string;
  destination: string;
  distance_km: number;
  duration_minutes: number;
};

export type Driver = {
  id: string;
  full_name: string;
  phone: string;
  license_number: string;
  active: boolean;
};

export type Schedule = {
  id: string;
  route_id: string;
  bus_id: string;
  driver_id: string | null;
  departure_time: string;
  arrival_time: string;
  base_price: number;
  status: "available" | "cancelled" | "completed";
  available_seats_estimate?: number;
  route?: Route;
  bus?: Bus;
  driver?: Driver | null;
};

export type ReservationStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type Reservation = {
  id: string;
  schedule_id: string;
  user_id: string;
  seat_numbers: number[];
  booking_date: string;
  amount: number;
  status: ReservationStatus;
  schedule?: Schedule;
};

export type Payment = {
  id: string;
  reservation_id: string;
  amount: number;
  method: "upi" | "card" | "net_banking" | "wallet";
  status: PaymentStatus;
  transaction_ref: string | null;
  paid_at: string | null;
};

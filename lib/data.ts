import { createClient } from "@/lib/supabase/server";
import type { Reservation, Schedule } from "@/lib/types";

export type ScheduleFilters = {
  from?: string;
  to?: string;
  date?: string;
  busType?: string;
  minPrice?: string;
  maxPrice?: string;
  departure?: "morning" | "afternoon" | "evening" | "night";
  sort?: "lowest_price" | "earliest_departure" | "shortest_duration";
};

export async function getSchedules(filters?: ScheduleFilters) {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("schedules")
      .select("*, route:routes(*), bus:buses(*), driver:drivers(*)")
      .eq("status", "available")
      .order("departure_time", { ascending: true });

    if (filters?.date) {
      query = query.gte("departure_time", `${filters.date}T00:00:00`).lte("departure_time", `${filters.date}T23:59:59`);
    }

    const { data, error } = await query;
    if (error) {
      console.warn("Schedules query failed:", error.message);
      return [];
    }

    let filtered = (data ?? []).filter((item) => {
      const fromOk = filters?.from ? item.route?.source?.toLowerCase().includes(filters.from.toLowerCase()) : true;
      const toOk = filters?.to ? item.route?.destination?.toLowerCase().includes(filters.to.toLowerCase()) : true;
      const busTypeOk = filters?.busType ? item.bus?.bus_type === filters.busType : true;
      const minPriceOk = filters?.minPrice ? Number(item.base_price) >= Number(filters.minPrice) : true;
      const maxPriceOk = filters?.maxPrice ? Number(item.base_price) <= Number(filters.maxPrice) : true;

      const depHour = new Date(item.departure_time).getHours();
      const departureOk = !filters?.departure
        ? true
        : filters.departure === "morning"
          ? depHour >= 5 && depHour < 12
          : filters.departure === "afternoon"
            ? depHour >= 12 && depHour < 17
            : filters.departure === "evening"
              ? depHour >= 17 && depHour < 21
              : depHour >= 21 || depHour < 5;

      return fromOk && toOk && busTypeOk && minPriceOk && maxPriceOk && departureOk;
    });

    if (filters?.sort === "lowest_price") {
      filtered = filtered.sort((a, b) => Number(a.base_price) - Number(b.base_price));
    } else if (filters?.sort === "earliest_departure") {
      filtered = filtered.sort((a, b) => +new Date(a.departure_time) - +new Date(b.departure_time));
    } else if (filters?.sort === "shortest_duration") {
      filtered = filtered.sort(
        (a, b) =>
          +new Date(a.arrival_time) - +new Date(a.departure_time) - (+new Date(b.arrival_time) - +new Date(b.departure_time)),
      );
    }

    const scheduleIds = filtered.map((s) => s.id);
    const { data: reservations } = await supabase
      .from("reservations")
      .select("schedule_id, seat_numbers, status")
      .in("schedule_id", scheduleIds)
      .in("status", ["pending", "confirmed"]);

    const seatMap = new Map<string, number>();
    (reservations ?? []).forEach((r) => {
      seatMap.set(r.schedule_id, (seatMap.get(r.schedule_id) ?? 0) + (r.seat_numbers as number[]).length);
    });

    filtered = filtered.map((s) => ({
      ...s,
      available_seats_estimate: Math.max(0, Number(s.bus?.total_seats ?? 0) - Number(seatMap.get(s.id) ?? 0)),
    }));

    return filtered as Schedule[];
  } catch (err) {
    console.error("[Data Engine] Critical fetch failure in getSchedules:", err);
    return [];
  }
}
export async function getScheduleById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("schedules")
      .select("*, route:routes(*), bus:buses(*), driver:drivers(*)")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return data as Schedule | null;
  } catch (err) {
    console.error("[Data Engine] getScheduleById failed:", err);
    return null;
  }
}

export async function getBookedSeats(scheduleId: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reservations")
      .select("seat_numbers")
      .eq("schedule_id", scheduleId)
      .in("status", ["pending", "confirmed"]);
    if (error) return [];
    return (data ?? []).flatMap((r) => r.seat_numbers as number[]);
  } catch (err) {
    console.error("[Data Engine] getBookedSeats failed:", err);
    return [];
  }
}

export async function getMyBookings() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from("reservations")
      .select("*, schedule:schedules(*, route:routes(*), bus:buses(*)), payment:payments(*)")
      .eq("user_id", user.id)
      .order("booking_date", { ascending: false });
    return (data ?? []) as (Reservation & { payment?: { status: string }[] })[];
  } catch (err) {
    console.error("[Data Engine] getMyBookings failed:", err);
    return [];
  }
}

export async function getMyProfile() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    return data;
  } catch (err) {
    console.error("[Data Engine] getMyProfile failed:", err);
    return null;
  }
}

export async function getMyPayments() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
      .from("payments")
      .select("*, reservation:reservations(*, schedule:schedules(*, route:routes(*), bus:buses(*)))")
      .order("created_at", { ascending: false });

    return (data ?? []).filter((p) => p.reservation?.user_id === user.id);
  } catch (err) {
    console.error("[Data Engine] getMyPayments failed:", err);
    return [];
  }
}

export async function isAdmin() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    return data?.role === "admin";
  } catch (err) {
    console.error("[Data Engine] isAdmin check failed:", err);
    return false;
  }
}

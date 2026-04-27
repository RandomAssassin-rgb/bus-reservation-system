"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function ensureAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (data?.role !== "admin") redirect("/");
  return supabase;
}

export async function signUp(formData: FormData) {
  try {
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    const fullName = String(formData.get("full_name") || "");

    console.log("--- Signup Process Started ---");
    console.log("Email:", email);

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return redirect("/auth/signup?error=Please%20enter%20a%20valid%20email%20address.");
    }

    const supabase = await createClient();
    const headersList = await (await import("next/headers")).headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    console.log("Attempting Supabase Auth SignUp...");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      console.error("Supabase Auth Error:", error);
      return redirect(`/auth/signup?error=${encodeURIComponent(error.message)}`);
    }

    console.log("Signup successful, user created:", data.user?.id);
    return redirect("/auth/login?success=Account%20created.%20Please%20check%20your%20email%20to%20confirm%20your%20account.");
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") throw err;
    console.error("FATAL Signup Exception:", err);
    
    // If we catch the "fetch failed" here, we give a more actionable message
    const errorMsg = err.message === "fetch failed" 
      ? "Network connectivity error. Please check if Supabase is reachable from your server."
      : err.message || "An unexpected error occurred.";
      
    return redirect(`/auth/signup?error=${encodeURIComponent(errorMsg)}`);
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");
    
    console.log("--- SignIn Process Started ---");
    
    if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 6) {
      return redirect("/auth/login?error=Invalid%20email%20or%20password%20format.");
    }
    
    const supabase = await createClient();

    console.log("Attempting Supabase Auth SignIn...");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      console.error("Supabase SignIn Error:", error);
      return redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
    }
    
    console.log("SignIn successful.");
    return redirect("/");
  } catch (err: any) {
    if (err.message === "NEXT_REDIRECT") throw err;
    console.error("FATAL Login Exception:", err);
    return redirect(`/auth/login?error=${encodeURIComponent(err.message || "Network handshake failed.")}`);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function updateProfile(formData: FormData) {
  const fullName = String(formData.get("full_name") || "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  await supabase.from("profiles").update({ full_name: fullName }).eq("id", user.id);
  revalidatePath("/account/personal-info");
}

export async function createReservation(formData: FormData) {
  const scheduleId = String(formData.get("scheduleId") || "");
  const seatNumbers = String(formData.get("seatNumbers") || "")
    .split(",")
    .map((v) => Number(v.trim()))
    .filter(Boolean);
  const method = String(formData.get("paymentMethod") || "upi");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Please sign in first." };
  if (!seatNumbers.length) return { error: "Please select at least one seat." };

  const { data: schedule } = await supabase.from("schedules").select("*").eq("id", scheduleId).single();
  if (!schedule) return { error: "Schedule not found." };

  const { data: existing } = await supabase
    .from("reservations")
    .select("seat_numbers")
    .eq("schedule_id", scheduleId)
    .in("status", ["pending", "confirmed"]);

  const alreadyTaken = new Set((existing ?? []).flatMap((r) => r.seat_numbers as number[]));
  const conflict = seatNumbers.find((s) => alreadyTaken.has(s));
  if (conflict) return { error: `Seat ${conflict} was just booked. Please reselect.` };

  const amount = Number(schedule.base_price) * seatNumbers.length;
  const { data: reservation, error } = await supabase
    .from("reservations")
    .insert({
      schedule_id: scheduleId,
      user_id: user.id,
      seat_numbers: seatNumbers,
      amount,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) return { error: error.message };

  const { error: paymentError } = await supabase.from("payments").insert({
    reservation_id: reservation.id,
    amount,
    method,
    status: "paid",
    paid_at: new Date().toISOString(),
    transaction_ref: `TXN-${Date.now()}`,
  });
  if (paymentError) return { error: paymentError.message };

  revalidatePath("/my-bookings");
  revalidatePath(`/schedules/${scheduleId}`);
  return { success: "Booking confirmed and payment recorded successfully." };
}

export async function updatePaymentStatus(formData: FormData) {
  const paymentId = String(formData.get("paymentId") || "");
  const status = String(formData.get("status") || "paid");
  const supabase = await ensureAdmin();

  const updates: Record<string, string | null> = { status };
  if (status === "paid") updates.paid_at = new Date().toISOString();

  const { error } = await supabase.from("payments").update(updates).eq("id", paymentId);
  if (error) return;

  revalidatePath("/my-bookings");
  revalidatePath("/admin");
}

export async function cancelReservation(formData: FormData) {
  const reservationId = String(formData.get("reservationId") || "");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: reservation } = await supabase.from("reservations").select("*").eq("id", reservationId).single();
  if (!reservation) return;
  if (reservation.user_id !== user.id) return;

  await supabase.from("reservations").update({ status: "cancelled" }).eq("id", reservationId);
  await supabase.from("payments").update({ status: "refunded" }).eq("reservation_id", reservationId);

  revalidatePath("/my-bookings");
}

export async function createBus(formData: FormData) {
  const supabase = await ensureAdmin();
  const payload = {
    name: String(formData.get("name") || ""),
    bus_number: String(formData.get("bus_number") || ""),
    bus_type: String(formData.get("bus_type") || "AC"),
    total_seats: Number(formData.get("total_seats") || 40),
    amenities: String(formData.get("amenities") || "")
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean),
    active: true,
  };
  const { error } = await supabase.from("buses").insert(payload);
  if (error) return;
  revalidatePath("/admin");
}

export async function deleteBus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const supabase = await ensureAdmin();
  await supabase.from("buses").delete().eq("id", id);
  revalidatePath("/admin");
}

export async function createRoute(formData: FormData) {
  const supabase = await ensureAdmin();
  const payload = {
    source: String(formData.get("source") || ""),
    destination: String(formData.get("destination") || ""),
    distance_km: Number(formData.get("distance_km") || 0),
    duration_minutes: Number(formData.get("duration_minutes") || 0),
  };
  const { error } = await supabase.from("routes").insert(payload);
  if (error) return;
  revalidatePath("/admin");
}

export async function deleteRoute(formData: FormData) {
  const id = String(formData.get("id") || "");
  const supabase = await ensureAdmin();
  await supabase.from("routes").delete().eq("id", id);
  revalidatePath("/admin");
}

export async function createDriver(formData: FormData) {
  const supabase = await ensureAdmin();
  const payload = {
    full_name: String(formData.get("full_name") || ""),
    phone: String(formData.get("phone") || ""),
    license_number: String(formData.get("license_number") || ""),
    active: true,
  };
  const { error } = await supabase.from("drivers").insert(payload);
  if (error) return;
  revalidatePath("/admin");
}

export async function deleteDriver(formData: FormData) {
  const id = String(formData.get("id") || "");
  const supabase = await ensureAdmin();
  await supabase.from("drivers").delete().eq("id", id);
  revalidatePath("/admin");
}

export async function createSchedule(formData: FormData) {
  const supabase = await ensureAdmin();
  const payload = {
    route_id: String(formData.get("route_id") || ""),
    bus_id: String(formData.get("bus_id") || ""),
    driver_id: String(formData.get("driver_id") || "") || null,
    departure_time: String(formData.get("departure_time") || ""),
    arrival_time: String(formData.get("arrival_time") || ""),
    base_price: Number(formData.get("base_price") || 0),
    status: "available",
  };
  const { error } = await supabase.from("schedules").insert(payload);
  if (error) return;
  revalidatePath("/admin");
}

export async function deleteSchedule(formData: FormData) {
  const id = String(formData.get("id") || "");
  const supabase = await ensureAdmin();
  await supabase.from("schedules").delete().eq("id", id);
  revalidatePath("/admin");
}

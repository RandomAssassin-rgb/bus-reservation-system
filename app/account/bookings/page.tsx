import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AccountBookingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");
  redirect("/my-bookings");
}

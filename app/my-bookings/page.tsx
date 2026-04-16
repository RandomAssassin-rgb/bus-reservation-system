import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { cancelReservation } from "@/app/actions";
import { getMyBookings } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MyBookingsPage() {
  const bookings = await getMyBookings();
  if (!bookings) redirect("/auth/login");

  return (
    <main className="tf-container flex-1 py-10">
      <div className="reveal-up premium-card overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=1600&q=80"
          alt="Travel booking management"
          width={1400}
          height={320}
          className="parallax-bg h-40 w-full object-cover"
        />
        <div className="p-6">
          <h1 className="tf-heading">My bookings</h1>
          <p className="mt-1 text-zinc-600">Track reservation, payment, and travel status in one place.</p>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {bookings.map((booking) => (
          <Card key={booking.id} className="reveal-up premium-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>{booking.schedule?.bus?.name ?? "Bus booking"}</CardTitle>
              <div className="flex gap-2">
                <Badge variant="secondary">{booking.status}</Badge>
                <Badge>{booking.payment?.[0]?.status ?? "pending"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-1 text-base text-zinc-700">
              <p>
                {booking.schedule?.route?.source} → {booking.schedule?.route?.destination}
              </p>
              <p>Seats: {booking.seat_numbers.join(", ")}</p>
              <p>Booked at: {format(new Date(booking.booking_date), "dd MMM yyyy, hh:mm a")}</p>
              <p>Payment method: {(booking as { payment?: { method?: string }[] }).payment?.[0]?.method ?? "N/A"}</p>
              <p className="font-semibold">Amount: INR {booking.amount}</p>
              {booking.status !== "cancelled" ? (
                <form action={cancelReservation} className="pt-2">
                  <input type="hidden" name="reservationId" value={booking.id} />
                  <Button type="submit" variant="outline">
                    Cancel booking
                  </Button>
                </form>
              ) : null}
            </CardContent>
          </Card>
        ))}
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
              <p className="text-zinc-600">No bookings yet.</p>
              <Link href="/search">
                <Button className="bg-rose-600 hover:bg-rose-700">Search buses</Button>
              </Link>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  );
}

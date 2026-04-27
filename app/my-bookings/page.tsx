import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { cancelReservation } from "@/app/actions";
import { getMyBookings } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, MapPin, Calendar, CreditCard, XCircle, Search, MoveRight, History } from "lucide-react";

export default async function MyBookingsPage() {
  const bookings = await getMyBookings();
  if (!bookings) redirect("/auth/login");

  return (
    <main className="mx-auto max-w-6xl px-4 py-24 min-h-screen">
      {/* Page Header */}
      <div className="reveal-up scroll-reveal mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <History className="size-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Expedition Archives</span>
          </div>
          <h1 className="text-5xl font-bold premium-gradient-text tracking-tighter">Your Bookings</h1>
          <p className="text-white/40 text-lg">Manage your reservations and travel history.</p>
        </div>
        
        <Link href="/search">
          <Button variant="premium" className="rounded-2xl h-14 px-8 shadow-2xl">
            <Search className="mr-2 size-4" /> New Booking
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <Card key={booking.id} className="reveal-up scroll-reveal glass-darker border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <Ticket className="size-48" />
            </div>
            
            <CardHeader className="p-8 pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-primary text-[10px] font-bold uppercase tracking-widest">{booking.schedule?.bus?.bus_number ?? "Elite Fleet"}</p>
                  <CardTitle className="text-2xl font-bold text-white">{booking.schedule?.bus?.name ?? "Premium Coach"}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge variant={booking.status === "cancelled" ? "destructive" : "premium"} className="px-4 py-1.5 rounded-full capitalize">
                    {booking.status}
                  </Badge>
                  <Badge variant="outline" className="px-4 py-1.5 rounded-full border-white/10 bg-white/5 capitalize">
                    {booking.payment?.[0]?.status ?? "Pending"}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-8 pt-0">
              <div className="grid md:grid-cols-3 gap-8 items-center py-8 border-y border-white/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                    <MapPin className="size-5 text-white/40" />
                  </div>
                  <div className="flex items-center gap-3 font-bold text-lg text-white">
                    <span>{booking.schedule?.route?.source}</span>
                    <MoveRight className="size-4 text-primary" />
                    <span>{booking.schedule?.route?.destination}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                    <Calendar className="size-5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Journey Date</p>
                    <p className="text-white/80 font-medium">{format(new Date(booking.booking_date), "dd MMM yyyy")}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                    <CreditCard className="size-5 text-white/40" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-0.5">Total Fair</p>
                    <p className="text-white font-bold text-xl">₹{booking.amount}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <p className="text-white/30 text-sm">Seats: <span className="text-white font-bold">{booking.seat_numbers.join(", ")}</span></p>
                  <div className="size-1 bg-white/10 rounded-full" />
                  <p className="text-white/30 text-sm">Ref ID: <span className="text-white font-mono text-xs uppercase">{booking.id.slice(0, 8)}</span></p>
                </div>
                
                {booking.status !== "cancelled" && (
                  <form action={cancelReservation}>
                    <input type="hidden" name="reservationId" value={booking.id} />
                    <Button type="submit" variant="ghost" className="text-white/40 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all">
                      <XCircle className="mr-2 size-4" /> Cancel Reservation
                    </Button>
                  </form>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {bookings.length === 0 && (
          <div className="reveal-up scroll-reveal flex flex-col items-center justify-center py-32 space-y-8 glass-darker border-white/5 rounded-[3rem]">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <Ticket className="size-24 text-white/10 relative z-10" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">No active expeditions</h3>
              <p className="text-white/40 max-w-sm">You haven't booked any premium travels yet. Discover our elite fleet and routes.</p>
            </div>
            <Link href="/search">
              <Button variant="premium" className="h-16 px-12 rounded-2xl font-bold shadow-2xl">
                Explore Fleet
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

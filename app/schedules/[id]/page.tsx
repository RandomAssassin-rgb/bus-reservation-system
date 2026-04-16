import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { BookingForm } from "@/components/booking-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBookedSeats, getScheduleById } from "@/lib/data";

export default async function ScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const schedule = await getScheduleById(id);
  if (!schedule) notFound();

  const bookedSeats = await getBookedSeats(id);
  return (
    <main className="tf-container grid flex-1 gap-6 py-10 md:grid-cols-[1fr_420px]">
      <Card className="reveal-up premium-card overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=80"
          alt="Premium bus interior"
          width={1400}
          height={360}
          className="parallax-bg h-52 w-full object-cover"
        />
        <CardHeader>
          <CardTitle className="text-2xl">{schedule.bus?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-base text-zinc-700">
          <p>
            Route: {schedule.route?.source} → {schedule.route?.destination}
          </p>
          <p>Departure: {format(new Date(schedule.departure_time), "dd MMM yyyy, hh:mm a")}</p>
          <p>Arrival: {format(new Date(schedule.arrival_time), "dd MMM yyyy, hh:mm a")}</p>
          <p>Duration: {(Math.round((+new Date(schedule.arrival_time) - +new Date(schedule.departure_time)) / 60000 / 6) / 10).toFixed(1)} hrs</p>
          <p>Driver: {schedule.driver?.full_name ?? "Not assigned"}</p>
          <p>Amenities: {schedule.bus?.amenities?.join(", ") || "Not listed"}</p>
          <p>Price per seat: INR {schedule.base_price}</p>
          <p>Total seats: {schedule.bus?.total_seats}</p>
        </CardContent>
      </Card>
      <div className="reveal-up">
        <BookingForm
          scheduleId={schedule.id}
          totalSeats={schedule.bus?.total_seats ?? 40}
          bookedSeats={bookedSeats}
          price={schedule.base_price}
        />
      </div>
    </main>
  );
}

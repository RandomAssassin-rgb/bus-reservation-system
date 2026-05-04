import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { BookingForm } from "@/components/booking-form";
import { Card, CardContent } from "@/components/ui/card";
import { getBookedSeats, getScheduleById } from "@/lib/data";
import { MoveRight, Info, Coffee, Wifi, Tv, Zap, Armchair } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function ScheduleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const schedule = await getScheduleById(id);
  if (!schedule) notFound();

  const bookedSeats = await getBookedSeats(id);
  
  const amenities = [
    { icon: Coffee, label: "Snacks", active: schedule.bus?.amenities?.includes("Snacks") },
    { icon: Wifi, label: "WiFi", active: schedule.bus?.amenities?.includes("WiFi") },
    { icon: Tv, label: "TV", active: schedule.bus?.amenities?.includes("TV") },
    { icon: Zap, label: "Charging", active: true },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 pt-36 pb-24 grid flex-1 gap-8 md:grid-cols-[1fr_420px]">
      <div className="space-y-8">
        {/* Journey Header */}
        <Card className="reveal-up glass-darker overflow-hidden border-white/5 rounded-[3rem]">
          <div className="relative h-64 w-full">
            <Image
              src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1600&q=80"
              alt="Premium bus interior"
              fill
              className="object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
              <div>
                <Badge variant="premium" className="mb-4">Premium Fleet</Badge>
                <h1 className="text-4xl font-bold text-white">{schedule.bus?.name}</h1>
                <p className="text-white/50 text-sm mt-1 uppercase tracking-[0.2em]">Expedition Registry: {schedule.bus?.bus_number}</p>
              </div>
              <div className="text-right">
                <p className="text-white/30 text-xs font-bold uppercase mb-1">Status</p>
                <div className="flex items-center gap-2 text-accent font-bold">
                  <div className="size-2 bg-accent rounded-full animate-pulse" />
                  Scheduled
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-10">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4">Route Itinerary</p>
                  <div className="flex items-center gap-4">
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-white">{schedule.route?.source}</p>
                      <p className="text-sm text-white/40">{format(new Date(schedule.departure_time), "hh:mm a")}</p>
                    </div>
                    <MoveRight className="text-primary size-6 grow-0" />
                    <div className="space-y-1">
                      <p className="text-2xl font-bold text-white">{schedule.route?.destination}</p>
                      <p className="text-sm text-white/40">{format(new Date(schedule.arrival_time), "hh:mm a")}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 py-6 border-y border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white/20 uppercase mb-1">Duration</p>
                    <p className="font-semibold">{(Math.round((+new Date(schedule.arrival_time) - +new Date(schedule.departure_time)) / 60000 / 6) / 10).toFixed(1)} hours</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white/20 uppercase mb-1">Pilot</p>
                    <p className="font-semibold">{schedule.driver?.full_name ?? "Elite Crew Assigned"}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-white/20 uppercase tracking-widest mb-4">Onboard Experience</p>
                <div className="grid grid-cols-2 gap-4">
                  {amenities.map((a, i) => (
                    <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${a.active ? "bg-white/5 border-white/10 text-white" : "opacity-20 border-transparent text-white/50"}`}>
                      <a.icon className="size-4" />
                      <span className="text-sm font-medium">{a.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center gap-2 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <Info className="size-4 text-primary" />
                  <p className="text-xs text-primary/80 leading-relaxed font-medium">Free refreshments and charging ports included for all travelers.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <aside className="reveal-up sticky top-24 h-fit">
        <BookingForm
          scheduleId={schedule.id}
          totalSeats={schedule.bus?.total_seats ?? 40}
          bookedSeats={bookedSeats}
          price={schedule.base_price}
        />
        <div className="mt-4 p-6 glass-darker rounded-3xl border-white/5 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Zap className="size-5 text-accent" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/30 uppercase tracking-tighter">Fast-Pass Enabled</p>
            <p className="text-sm font-medium">Auto-confirm and priority boarding.</p>
          </div>
        </div>
      </aside>
    </main>
  );
}

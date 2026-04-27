import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getSchedules } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Bus, Clock, MapPin, Filter, IndianRupee, SearchX } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; date?: string }>;
}) {
  const params = await searchParams;
  const schedules = await getSchedules(params);

  return (
    <main className="mx-auto max-w-6xl px-4 py-24 flex flex-1 flex-col">
      {/* Header Banner */}
      <div className="reveal-up glass-darker overflow-hidden rounded-[2.5rem] mb-8 border-white/5">
        <div className="relative h-48 w-full">
          <Image
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=80"
            alt="Bus route search"
            fill
            className="object-cover opacity-40 rounded-t-[2.5rem]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          <div className="absolute bottom-8 left-8">
            <h1 className="text-4xl font-bold premium-gradient-text">Expeditions Found</h1>
            <div className="mt-2 flex items-center gap-3 text-white/50 text-sm font-medium uppercase tracking-widest">
              <span>{params.from || "Origins"}</span>
              <span className="text-primary">→</span>
              <span>{params.to || "Destinations"}</span>
              <span className="mx-2 opacity-20">|</span>
              <span>{params.date ? format(new Date(params.date), "MMMM dd, yyyy") : "All Dates"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <form className="reveal-up scroll-reveal glass p-4 rounded-3xl mb-8 flex flex-wrap gap-4 items-end border-white/5">
        <div className="flex-1 min-w-[200px] space-y-2">
          <label className="text-[10px] uppercase tracking-tighter text-white/30 font-bold ml-1">Fleet Type</label>
          <select name="busType" defaultValue={(params as { busType?: string }).busType ?? ""} className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:bg-white/10 outline-none transition-all">
            <option value="">All Fleets</option>
            <option value="AC">Premium AC</option>
            <option value="Non-AC">Standard Non-AC</option>
            <option value="Sleeper">Executive Sleeper</option>
            <option value="Semi-Sleeper">Comfort Semi-Sleeper</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[150px] space-y-2">
          <label className="text-[10px] uppercase tracking-tighter text-white/30 font-bold ml-1">Departure Slot</label>
          <select name="departure" defaultValue={(params as { departure?: string }).departure ?? ""} className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:bg-white/10 outline-none transition-all">
            <option value="">Any Time</option>
            <option value="morning">Morning (6AM - 12PM)</option>
            <option value="afternoon">Afternoon (12PM - 6PM)</option>
            <option value="evening">Evening (6PM - 10PM)</option>
            <option value="night">Night (10PM - 6AM)</option>
          </select>
        </div>

        <div className="w-[180px] space-y-2">
          <label className="text-[10px] uppercase tracking-tighter text-white/30 font-bold ml-1">Sort By</label>
          <select name="sort" defaultValue={(params as { sort?: string }).sort ?? ""} className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-sm text-white focus:bg-white/10 outline-none transition-all">
            <option value="">Sort Options</option>
            <option value="lowest_price">Lowest Fair</option>
            <option value="earliest_departure">Early Birds</option>
            <option value="shortest_duration">Fastest Route</option>
          </select>
        </div>

        <Button type="submit" variant="premium" className="h-12 px-8 rounded-2xl">
          <Filter className="size-4 mr-2" />
          Refine Results
        </Button>
      </form>

      {/* Results List */}
      <div className="grid gap-6">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="reveal-up scroll-reveal group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 to-accent/0 rounded-3xl blur opacity-0 group-hover:opacity-20 group-hover:from-primary group-hover:to-accent transition duration-500" />
            <Card className="relative glass-darker border-white/5 overflow-hidden rounded-3xl transition-all duration-500 group-hover:border-white/10">
              <CardContent className="p-8">
                <div className="grid gap-8 md:grid-cols-[2fr_1fr_1fr_auto] items-center">
                  
                  {/* Bus Info */}
                  <div className="flex items-start gap-4">
                    <div className="size-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:bg-primary/10 transition-colors">
                      <Bus className="size-7 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {schedule.bus?.name ?? "Fleet"}
                        </h3>
                        <Badge variant="outline" className="text-[10px] border-white/10 text-white/40 uppercase">
                          {schedule.bus?.bus_type}
                        </Badge>
                      </div>
                      <p className="text-white/30 text-sm flex items-center gap-2">
                        <MapPin className="size-3" />
                        ID: {schedule.bus?.bus_number} • {schedule.bus?.amenities?.slice(0, 2).join(" • ")}
                      </p>
                    </div>
                  </div>

                  {/* Journey Info */}
                  <div className="space-y-1">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Departure</p>
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-accent" />
                      <p className="text-lg font-semibold">{format(new Date(schedule.departure_time), "hh:mm a")}</p>
                    </div>
                    <p className="text-white/40 text-sm italic">{format(new Date(schedule.departure_time), "dd MMM")}</p>
                  </div>

                  {/* Fair Info */}
                  <div className="space-y-1">
                    <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Base Fair</p>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="size-5 text-primary" />
                      <p className="text-3xl font-bold text-white">{schedule.base_price}</p>
                    </div>
                    <p className="text-white/40 text-xs">
                      {(Math.round((+new Date(schedule.arrival_time) - +new Date(schedule.departure_time)) / 60000 / 6) / 10).toFixed(1)}h duration
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="text-right">
                    <p className="text-xs text-accent font-bold mb-4 uppercase tracking-tighter">
                      {schedule.available_seats_estimate ?? schedule.bus?.total_seats ?? 0} elite seats left
                    </p>
                    <Link href={`/schedules/${schedule.id}`}>
                      <Button variant="premium" size="lg" className="px-8 shadow-xl">
                        Select Seat
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {schedules.length === 0 && (
          <div className="reveal-up py-20 text-center">
            <div className="size-24 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
              <SearchX className="size-10 text-white/20" />
            </div>
            <h3 className="text-2xl font-bold mb-2">No expeditions found</h3>
            <p className="text-white/40">Try adjusting your filters or search for another date.</p>
            <Button variant="outline" className="mt-8 border-white/5" onClick={() => window.location.href='/search'}>
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}

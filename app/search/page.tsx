import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { getSchedules } from "@/lib/data";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; date?: string }>;
}) {
  const params = await searchParams;
  const schedules = await getSchedules(params);

  return (
    <main className="tf-container flex flex-1 flex-col py-10">
      <div className="reveal-up premium-card overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=80"
          alt="Bus route search"
          width={1400}
          height={320}
          className="parallax-bg h-44 w-full object-cover"
        />
        <div className="p-6">
          <h1 className="tf-heading">Available buses</h1>
          <p className="mt-1 text-base text-zinc-600">
            {params.from || "Any city"} to {params.to || "Any destination"} on {params.date || "any date"}
          </p>
        </div>
      </div>
      <form className="mt-4 grid gap-3 rounded-2xl border bg-white p-4 md:grid-cols-6">
        <Input name="from" placeholder="From" defaultValue={params.from} />
        <Input name="to" placeholder="To" defaultValue={params.to} />
        <Input name="date" type="date" defaultValue={params.date} />
        <Input name="minPrice" type="number" placeholder="Min price" defaultValue={(params as { minPrice?: string }).minPrice} />
        <Input name="maxPrice" type="number" placeholder="Max price" defaultValue={(params as { maxPrice?: string }).maxPrice} />
        <select name="busType" defaultValue={(params as { busType?: string }).busType ?? ""} className="h-10 rounded-md border px-3 text-sm">
          <option value="">Bus type</option>
          <option value="AC">AC</option>
          <option value="Non-AC">Non-AC</option>
          <option value="Sleeper">Sleeper</option>
          <option value="Semi-Sleeper">Semi-Sleeper</option>
        </select>
        <select name="departure" defaultValue={(params as { departure?: string }).departure ?? ""} className="h-10 rounded-md border px-3 text-sm">
          <option value="">Departure slot</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
          <option value="night">Night</option>
        </select>
        <select name="sort" defaultValue={(params as { sort?: string }).sort ?? ""} className="h-10 rounded-md border px-3 text-sm">
          <option value="">Sort by</option>
          <option value="lowest_price">Lowest price</option>
          <option value="earliest_departure">Earliest departure</option>
          <option value="shortest_duration">Shortest duration</option>
        </select>
        <Button type="submit" className="md:col-span-2 bg-[#d84e55] hover:bg-[#c63f46]">
          Apply filters
        </Button>
      </form>
      <div className="mt-6 grid gap-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} className="reveal-up premium-card">
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>
                {schedule.bus?.name ?? "Bus"} <span className="text-sm font-normal text-zinc-500">({schedule.bus?.bus_number})</span>
              </CardTitle>
              <Badge className="bg-[#d84e55]">{schedule.bus?.bus_type ?? "AC"}</Badge>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-4 md:items-center">
              <p className="text-base text-zinc-700">
                {schedule.route?.source} → {schedule.route?.destination}
              </p>
              <p className="text-base">{format(new Date(schedule.departure_time), "dd MMM, hh:mm a")}</p>
              <div className="text-base">
                <p className="text-lg font-semibold">INR {schedule.base_price}</p>
                <p className="text-sm text-zinc-500">
                  {(Math.round((+new Date(schedule.arrival_time) - +new Date(schedule.departure_time)) / 60000 / 6) / 10).toFixed(1)} hrs
                </p>
                <p className="text-sm text-zinc-500">Seats left: {schedule.available_seats_estimate ?? schedule.bus?.total_seats ?? 0}</p>
              </div>
              <Link href={`/schedules/${schedule.id}`} className="md:justify-self-end">
                <Button className="bg-rose-600 hover:bg-rose-700">View seats</Button>
              </Link>
            </CardContent>
            {schedule.bus?.amenities?.length ? (
              <CardContent className="pt-0">
                <p className="text-sm text-zinc-500">Amenities: {schedule.bus.amenities.join(", ")}</p>
              </CardContent>
            ) : null}
          </Card>
        ))}
        {schedules.length === 0 ? <p className="text-sm text-zinc-500">No schedules matched your search.</p> : null}
      </div>
    </main>
  );
}

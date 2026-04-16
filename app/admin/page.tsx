import { redirect } from "next/navigation";
import Image from "next/image";
import { createBus, createDriver, createRoute, createSchedule, deleteBus, deleteDriver, deleteRoute, deleteSchedule, updatePaymentStatus } from "@/app/actions";
import { isAdmin } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function AdminPage() {
  const admin = await isAdmin();
  if (!admin) redirect("/auth/login");

  const supabase = await createClient();
  const [buses, routes, drivers, schedules, reservations, payments] = await Promise.all([
    supabase.from("buses").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("routes").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("drivers").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("schedules").select("*, route:routes(*), bus:buses(*)").order("departure_time", { ascending: false }).limit(20),
    supabase.from("reservations").select("*, schedule:schedules(*, route:routes(*))").order("booking_date", { ascending: false }).limit(20),
    supabase.from("payments").select("*, reservation:reservations(*)").order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <main className="tf-container flex-1 py-10">
      <div className="reveal-up premium-card overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1600&q=80"
          alt="Operations dashboard"
          width={1400}
          height={320}
          className="parallax-bg h-40 w-full object-cover"
        />
        <div className="p-6">
          <h1 className="tf-heading">Admin dashboard</h1>
          <p className="mt-1 text-base text-zinc-600">Manage buses, routes, drivers, schedules, reservations, and payments.</p>
        </div>
      </div>

      <Tabs defaultValue="buses" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 bg-white md:grid-cols-6">
          <TabsTrigger value="buses">Buses</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="schedules">Schedules</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="buses" className="space-y-4">
          <Card className="premium-card">
            <CardHeader><CardTitle>Add bus</CardTitle></CardHeader>
            <CardContent>
              <form action={createBus} className="grid gap-2 md:grid-cols-5">
                <Input name="name" placeholder="Bus name" required />
                <Input name="bus_number" placeholder="Bus number" required />
                <Input name="bus_type" placeholder="AC/Sleeper" required />
                <Input name="total_seats" placeholder="Seats" type="number" required />
                <Input name="amenities" placeholder="WiFi, Charging" />
                <Button className="md:col-span-5">Create bus</Button>
              </form>
            </CardContent>
          </Card>
          {buses.data?.map((b) => (
            <Card key={b.id} className="reveal-up premium-card">
              <CardContent className="flex items-center justify-between p-4">
                <p>{b.name} ({b.bus_number})</p>
                <div className="flex items-center gap-2">
                  <Badge>{b.bus_type}</Badge>
                  <form action={deleteBus}>
                    <input type="hidden" name="id" value={b.id} />
                    <Button size="sm" variant="outline">Delete</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card className="premium-card"><CardHeader><CardTitle>Add route</CardTitle></CardHeader><CardContent><form action={createRoute} className="grid gap-2 md:grid-cols-4"><Input name="source" placeholder="Source" required /><Input name="destination" placeholder="Destination" required /><Input name="distance_km" type="number" placeholder="Distance km" required /><Input name="duration_minutes" type="number" placeholder="Duration min" required /><Button className="md:col-span-4">Create route</Button></form></CardContent></Card>
          {routes.data?.map((r) => (
            <Card key={r.id} className="reveal-up premium-card">
              <CardContent className="flex items-center justify-between p-4">
                <p>{r.source} → {r.destination}</p>
                <form action={deleteRoute}>
                  <input type="hidden" name="id" value={r.id} />
                  <Button size="sm" variant="outline">Delete</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <Card className="premium-card"><CardHeader><CardTitle>Add driver</CardTitle></CardHeader><CardContent><form action={createDriver} className="grid gap-2 md:grid-cols-3"><Input name="full_name" placeholder="Driver name" required /><Input name="phone" placeholder="Phone" required /><Input name="license_number" placeholder="License no" required /><Button className="md:col-span-3">Create driver</Button></form></CardContent></Card>
          {drivers.data?.map((d) => (
            <Card key={d.id} className="reveal-up premium-card">
              <CardContent className="flex items-center justify-between p-4">
                <p>{d.full_name} ({d.phone})</p>
                <form action={deleteDriver}>
                  <input type="hidden" name="id" value={d.id} />
                  <Button size="sm" variant="outline">Delete</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card className="premium-card">
            <CardHeader><CardTitle>Add schedule</CardTitle></CardHeader>
            <CardContent>
              <form action={createSchedule} className="grid gap-2 md:grid-cols-3">
                <Label className="md:col-span-3">Use IDs from listed entries below.</Label>
                <Input name="route_id" placeholder="Route ID" required />
                <Input name="bus_id" placeholder="Bus ID" required />
                <Input name="driver_id" placeholder="Driver ID (optional)" />
                <Input name="departure_time" type="datetime-local" required />
                <Input name="arrival_time" type="datetime-local" required />
                <Input name="base_price" type="number" placeholder="Base price" required />
                <Button className="md:col-span-3">Create schedule</Button>
              </form>
            </CardContent>
          </Card>
          {schedules.data?.map((s) => (
            <Card key={s.id} className="reveal-up premium-card">
              <CardContent className="flex items-center justify-between p-4">
                <p>{s.bus?.name} | {s.route?.source} → {s.route?.destination}</p>
                <form action={deleteSchedule}>
                  <input type="hidden" name="id" value={s.id} />
                  <Button size="sm" variant="outline">Delete</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          {reservations.data?.map((r) => (
            <Card key={r.id} className="reveal-up premium-card"><CardContent className="flex items-center justify-between p-4"><div><p>{r.schedule?.route?.source} → {r.schedule?.route?.destination}</p><p className="text-xs text-zinc-500">Seats: {(r.seat_numbers as number[]).join(", ")}</p></div><Badge>{r.status}</Badge></CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {payments.data?.map((p) => (
            <Card key={p.id} className="reveal-up premium-card">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium">Reservation: {p.reservation_id}</p>
                  <p className="text-sm text-zinc-600">INR {p.amount} · {p.method}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge>{p.status}</Badge>
                  <form action={updatePaymentStatus}>
                    <input type="hidden" name="paymentId" value={p.id} />
                    <input type="hidden" name="status" value="paid" />
                    <Button size="sm" variant="outline">Mark paid</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </main>
  );
}

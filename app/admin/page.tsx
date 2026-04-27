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
    <main className="mx-auto max-w-[1400px] px-4 py-24 min-h-screen">
      <div className="reveal-up scroll-reveal mb-12 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 uppercase tracking-widest text-[10px]">Security Clearance: Omega</Badge>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
            Command<br />
            <span className="text-white/40">Center</span>
          </h1>
        </div>
      </div>

      <div className="reveal-up scroll-reveal overflow-hidden rounded-[2.5rem] relative mb-12 border border-white/5 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-transparent z-10" />
        <Image
          src="https://images.unsplash.com/photo-1541888079549-923f66c17244?auto=format&fit=crop&w=1600&q=80"
          alt="Operations dashboard"
          width={1400}
          height={320}
          className="h-48 w-full object-cover"
        />
        <div className="absolute bottom-6 left-8 z-20">
          <p className="text-xl font-bold text-white tracking-tight">Active Matrix</p>
          <p className="text-sm text-white/50 font-medium">Monitoring fleets, schedules, and global telemetry.</p>
        </div>
      </div>

      <Tabs defaultValue="buses" className="mt-6 scroll-reveal">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 glass rounded-2xl h-16 p-2 mb-8 bg-black/40 border border-white/5">
          <TabsTrigger value="buses" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 uppercase tracking-widest text-xs font-bold transition-all">Buses</TabsTrigger>
          <TabsTrigger value="routes" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 uppercase tracking-widest text-xs font-bold transition-all">Routes</TabsTrigger>
          <TabsTrigger value="drivers" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 uppercase tracking-widest text-xs font-bold transition-all">Drivers</TabsTrigger>
          <TabsTrigger value="schedules" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 uppercase tracking-widest text-xs font-bold transition-all">Schedules</TabsTrigger>
          <TabsTrigger value="reservations" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 uppercase tracking-widest text-xs font-bold transition-all">Bookings</TabsTrigger>
          <TabsTrigger value="payments" className="rounded-xl data-[state=active]:bg-primary/20 data-[state=active]:text-primary text-white/50 uppercase tracking-widest text-xs font-bold transition-all">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="buses" className="space-y-4">
          <Card className="glass-dark border border-white/5 rounded-3xl">
            <CardHeader><CardTitle className="text-white">Add Fleet Unit</CardTitle></CardHeader>
            <CardContent>
              <form action={createBus} className="grid gap-4 md:grid-cols-5">
                <Input name="name" placeholder="Bus name" className="glass-darker border-white/10 text-white placeholder:text-white/30" required />
                <Input name="bus_number" placeholder="Bus number" className="glass-darker border-white/10 text-white placeholder:text-white/30" required />
                <Input name="bus_type" placeholder="AC/Sleeper" className="glass-darker border-white/10 text-white placeholder:text-white/30" required />
                <Input name="total_seats" placeholder="Seats" type="number" className="glass-darker border-white/10 text-white placeholder:text-white/30" required />
                <Input name="amenities" placeholder="WiFi, Charging" className="glass-darker border-white/10 text-white placeholder:text-white/30" />
                <Button variant="premium" className="md:col-span-5 h-12 uppercase tracking-widest">Deploy Unit</Button>
              </form>
            </CardContent>
          </Card>
          {buses.data?.map((b) => (
            <Card key={b.id} className="reveal-up glass-darker border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
              <CardContent className="flex items-center justify-between p-6">
                <p className="text-white font-medium">{b.name} <span className="text-white/40">[{b.bus_number}]</span></p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-white/10 text-white border-0">{b.bus_type}</Badge>
                  <form action={deleteBus}>
                    <input type="hidden" name="id" value={b.id} />
                    <Button size="sm" variant="ghost" className="text-accent hover:text-accent hover:bg-accent/10">Deactivate</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card className="glass-dark border border-white/5 rounded-3xl"><CardHeader><CardTitle className="text-white">New Corridor</CardTitle></CardHeader><CardContent><form action={createRoute} className="grid gap-4 md:grid-cols-4"><Input name="source" placeholder="Source" className="glass-darker border-white/10 text-white placeholder:text-white/30" required /><Input name="destination" placeholder="Destination" className="glass-darker border-white/10 text-white placeholder:text-white/30" required /><Input name="distance_km" type="number" placeholder="Distance km" className="glass-darker border-white/10 text-white placeholder:text-white/30" required /><Input name="duration_minutes" type="number" placeholder="Duration min" className="glass-darker border-white/10 text-white placeholder:text-white/30" required /><Button variant="premium" className="md:col-span-4 h-12 uppercase tracking-widest">Establish Corridor</Button></form></CardContent></Card>
          {routes.data?.map((r) => (
            <Card key={r.id} className="reveal-up glass-darker border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
              <CardContent className="flex items-center justify-between p-6">
                <p className="text-white font-medium">{r.source} <span className="text-white/20 mx-2">→</span> {r.destination}</p>
                <form action={deleteRoute}>
                  <input type="hidden" name="id" value={r.id} />
                  <Button size="sm" variant="ghost" className="text-accent hover:bg-accent/10 hover:text-accent">Delete</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="drivers" className="space-y-4">
          <Card className="glass-dark border border-white/5 rounded-3xl"><CardHeader><CardTitle className="text-white">Register Operative</CardTitle></CardHeader><CardContent><form action={createDriver} className="grid gap-4 md:grid-cols-3"><Input name="full_name" placeholder="Driver name" className="glass-darker border-white/10 text-white placeholder:text-white/30" required /><Input name="phone" placeholder="Phone" className="glass-darker border-white/10 text-white placeholder:text-white/30" required /><Input name="license_number" placeholder="License no" className="glass-darker border-white/10 text-white placeholder:text-white/30" required /><Button variant="premium" className="md:col-span-3 h-12 uppercase tracking-widest">Register</Button></form></CardContent></Card>
          {drivers.data?.map((d) => (
            <Card key={d.id} className="reveal-up glass-darker border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
              <CardContent className="flex items-center justify-between p-6">
                <p className="text-white font-medium">{d.full_name} <span className="text-white/40">({d.phone})</span></p>
                <form action={deleteDriver}>
                  <input type="hidden" name="id" value={d.id} />
                  <Button size="sm" variant="ghost" className="text-accent hover:bg-accent/10 hover:text-accent">Revoke</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card className="glass-dark border border-white/5 rounded-3xl">
            <CardHeader><CardTitle className="text-white">Deploy Schedule</CardTitle></CardHeader>
            <CardContent>
              <form action={createSchedule} className="grid gap-4 md:grid-cols-3">
                <Label className="md:col-span-3 text-white/50">Cross-reference IDs from active matrices below.</Label>
                <Input name="route_id" placeholder="Route ID" className="glass-darker border-white/10 text-white placeholder:text-white/30" required />
                <Input name="bus_id" placeholder="Bus ID" className="glass-darker border-white/10 text-white placeholder:text-white/30" required />
                <Input name="driver_id" placeholder="Driver ID (optional)" className="glass-darker border-white/10 text-white placeholder:text-white/30" />
                <div className="space-y-1"><Label className="text-xs text-white/50">Departure</Label><Input name="departure_time" type="datetime-local" className="glass-darker border-white/10 text-white" required /></div>
                <div className="space-y-1"><Label className="text-xs text-white/50">Arrival</Label><Input name="arrival_time" type="datetime-local" className="glass-darker border-white/10 text-white" required /></div>
                <div className="space-y-1"><Label className="text-xs text-white/50">Base Tariff (INR)</Label><Input name="base_price" type="number" placeholder="Base price" className="glass-darker border-white/10 text-white placeholder:text-white/30" required /></div>
                <Button variant="premium" className="md:col-span-3 h-12 uppercase tracking-widest mt-2">Initialize Flight</Button>
              </form>
            </CardContent>
          </Card>
          {schedules.data?.map((s) => (
            <Card key={s.id} className="reveal-up glass-darker border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
              <CardContent className="flex items-center justify-between p-6">
                <p className="text-white font-medium">{s.bus?.name} <span className="text-white/20 mx-2">|</span> {s.route?.source} → {s.route?.destination}</p>
                <form action={deleteSchedule}>
                  <input type="hidden" name="id" value={s.id} />
                  <Button size="sm" variant="ghost" className="text-accent hover:bg-accent/10 hover:text-accent">Terminate</Button>
                </form>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="reservations" className="space-y-4">
          {reservations.data?.map((r) => (
            <Card key={r.id} className="reveal-up glass-darker border border-white/5 rounded-2xl hover:border-white/10 transition-colors"><CardContent className="flex items-center justify-between p-6"><div><p className="text-white font-medium">{r.schedule?.route?.source} → {r.schedule?.route?.destination}</p><p className="text-xs text-white/40 mt-1 uppercase tracking-widest">Seats: {Array.isArray(r.seat_numbers) ? r.seat_numbers.join(", ") : r.seat_numbers}</p></div><Badge className="bg-primary/20 text-primary border-0">{r.status}</Badge></CardContent></Card>
          ))}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {payments.data?.map((p) => (
            <Card key={p.id} className="reveal-up glass-darker border border-white/5 rounded-2xl hover:border-white/10 transition-colors">
              <CardContent className="flex flex-wrap items-center justify-between gap-3 p-6">
                <div>
                  <p className="font-medium text-white text-xs uppercase tracking-widest mb-1">Reservation: <span className="text-white/50">{p.reservation_id}</span></p>
                  <p className="text-sm text-primary font-bold">INR {p.amount} <span className="text-white/40 font-normal">· {p.method}</span></p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-white/10 text-white border-0">{p.status}</Badge>
                  <form action={updatePaymentStatus}>
                    <input type="hidden" name="paymentId" value={p.id} />
                    <input type="hidden" name="status" value="paid" />
                    <Button size="sm" variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Mark Verified</Button>
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

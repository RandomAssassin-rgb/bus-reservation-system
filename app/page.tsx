import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StickySearch } from "@/components/home/sticky-search";
import { OfferCarousel } from "@/components/home/offer-carousel";
import { RouteChips } from "@/components/home/route-chips";

export default function Home() {
  return (
    <main className="flex-1 bg-[#f7f7f7] pb-16">
      <StickySearch />
      <section className="premium-gradient relative overflow-hidden px-4 pb-20 pt-14 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="reveal-up max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">Travel smarter with seamless bus bookings across trusted operators.</h1>
          <p className="reveal-up mt-4 max-w-xl text-base text-white/95 md:text-lg">
            Compare routes, pick the right seat, and manage every trip from one premium booking experience.
          </p>
          <form id="hero-search-anchor" action="/search" className="reveal-up mt-10 rounded-3xl bg-white p-3 text-zinc-900 shadow-2xl">
            <div className="grid gap-2 md:grid-cols-[1fr_1fr_200px_170px]">
              <Input name="from" placeholder="From" className="h-14 rounded-2xl border-zinc-200" required />
              <Input name="to" placeholder="To" className="h-14 rounded-2xl border-zinc-200" required />
              <Input name="date" type="date" className="h-14 rounded-2xl border-zinc-200" required />
              <Button type="submit" className="h-14 rounded-2xl bg-[#d84e55] text-base hover:bg-[#c63f46]">
                Search buses
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto -mt-12 grid max-w-6xl gap-4 px-4 md:grid-cols-2">
        <OfferCarousel />
        <div className="reveal-up premium-card border border-[#ececec] bg-white p-6">
          <p className="text-lg font-semibold text-zinc-900">Smart savings</p>
          <p className="mt-2 text-base text-zinc-600">Get dynamic pricing insights before checkout and book at the right time.</p>
          <div className="mt-4 flex gap-2">
            <Badge className="bg-zinc-800">Best fare alerts</Badge>
            <Badge variant="secondary">Operator deals</Badge>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 px-4 md:grid-cols-4">
        {[
          { title: "4,500+", value: "Routes active", desc: "Daily departures across major cities." },
          { title: "900+", value: "Bus partners", desc: "Private and government operators." },
          { title: "24/7", value: "Support desk", desc: "Round-the-clock help for trips." },
          { title: "99.9%", value: "Payment uptime", desc: "Reliable booking and confirmations." },
        ].map((item) => (
          <Card key={item.value} className="reveal-up rounded-2xl border border-zinc-200 bg-white">
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-[#d84e55]">{item.title}</p>
              <p className="mt-1 text-base font-medium text-zinc-900">{item.value}</p>
              <p className="mt-1 text-sm text-zinc-500">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-4">
        <RouteChips />
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-zinc-900">What&apos;s new</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-4">
          {["Free Cancellation", "Bus timetable", "Flexi Ticket", "Assurance Program"].map((item) => (
            <Card key={item} className="reveal-up rounded-2xl border border-[#e8e8e8] bg-white shadow-sm">
              <CardContent className="p-5">
                <h3 className="font-semibold">{item}</h3>
                <p className="mt-2 text-base text-zinc-600">Know more about features designed for stress-free travel.</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl rounded-2xl border border-zinc-200 bg-white/95 px-8 py-10 shadow-sm backdrop-blur">
        <h2 className="text-3xl font-bold text-zinc-900">Why travelers choose TransitFlow</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-700">
          <li>Free Cancellation and flexible ticket options.</li>
          <li>Live bus tracking, operator ratings, and trusted service badges.</li>
          <li>Secure checkout with payment status tracking and booking history.</li>
        </ul>
        <div className="mt-6 flex gap-3">
          <Link href="/search">
            <Button className="bg-[#d84e55] hover:bg-[#c63f46]">Book now</Button>
          </Link>
          <Link href="/my-bookings">
            <Button variant="outline">My bookings</Button>
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-6 px-4 md:grid-cols-2">
        <div className="premium-card reveal-up overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1400&q=80"
            alt="Luxury bus travel"
            width={1200}
            height={400}
            className="parallax-bg h-64 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold">Government & private buses</h3>
            <p className="mt-2 text-zinc-600">Compare timings, amenities, and prices from multiple operators in one place.</p>
          </div>
        </div>
        <div className="premium-card reveal-up overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=1400&q=80"
            alt="Mobile travel booking"
            width={1200}
            height={400}
            className="parallax-bg h-64 w-full object-cover"
          />
          <div className="p-6">
            <h3 className="text-2xl font-semibold">Book instantly on any device</h3>
            <p className="mt-2 text-zinc-600">Fast checkout, clear itinerary, and real-time booking status on every reservation.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-zinc-900">Top routes this week</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            { route: "Kolkata → Durgapur", price: "Starts at INR 499", time: "6h avg duration" },
            { route: "Delhi → Jaipur", price: "Starts at INR 599", time: "5h avg duration" },
            { route: "Bangalore → Chennai", price: "Starts at INR 699", time: "7h avg duration" },
          ].map((item) => (
            <Card key={item.route} className="reveal-up premium-card">
              <CardContent className="p-6">
                <p className="text-lg font-semibold">{item.route}</p>
                <p className="mt-2 text-base text-zinc-600">{item.time}</p>
                <p className="mt-3 font-semibold text-[#d84e55]">{item.price}</p>
                <Link href="/search">
                  <Button variant="outline" className="mt-4 w-full">
                    Check schedules
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-zinc-900">What customers say</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            "Clean buses, smooth boarding, and quick confirmations every time.",
            "Seat map and payment status tracking made planning very easy.",
            "Best part is having route options and support in one place.",
          ].map((quote, idx) => (
            <Card key={quote} className="reveal-up rounded-2xl border border-zinc-200 bg-white">
              <CardContent className="p-6">
                <p className="text-zinc-700">&quot;{quote}&quot;</p>
                <p className="mt-4 text-base font-medium text-zinc-900">Traveler #{idx + 1}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4">
        <div className="reveal-up premium-card premium-gradient overflow-hidden px-8 py-10 text-white">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <h2 className="text-3xl font-bold">Plan, book, and track every ride with TransitFlow</h2>
              <p className="mt-2 max-w-2xl text-white/90">
                Built for modern travel workflows with booking history, payment visibility, and admin-ready operations.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/search">
                <Button className="bg-[#d84e55] hover:bg-[#c63f46]">Search buses</Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                  Create account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-zinc-900">Frequently asked questions</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {[
            ["Can I cancel or reschedule my trip?", "Yes, available schedules support cancellation and rescheduling policies based on operator rules."],
            ["How do I track payment status?", "Every reservation includes payment status in your My Bookings page and admin payment panel."],
            ["Do you support seat selection?", "Yes, you can pick available seats directly from the seat map before confirming a booking."],
            ["Can I manage operations as admin?", "Yes, admins can manage buses, routes, drivers, schedules, reservations, and payments."],
          ].map(([q, a]) => (
            <Card key={q} className="reveal-up rounded-2xl border border-zinc-200 bg-white">
              <CardContent className="p-6">
                <p className="font-semibold">{q}</p>
                <p className="mt-2 text-base text-zinc-600">{a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

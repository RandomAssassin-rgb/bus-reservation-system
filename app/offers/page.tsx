import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Search, ArrowRight, Wallet } from "lucide-react";

const offers = [
  { code: "ELITE300", title: "Complimentary Upgrade", details: "Receive INR 300 instant credit on your next premium AC or Sleeper reservation." },
  { code: "METROVIP", title: "Metropolitan Route Privilege", details: "Exclusive cashback for active business corridors connecting major hubs." },
  { code: "WEEKENDER", title: "Weekend Leisure Credit", details: "Extra wallet benefits applied automatically for Friday-Sunday expeditions." },
  { code: "BLACKCARD", title: "Partner Integration", details: "Maximized limits and exclusive seating rows for partnered luxury cardholders." },
];

export default function OffersPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-24 min-h-screen">
      {/* Cinematic Header */}
      <div className="reveal-up scroll-reveal mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="size-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">The Privilege Deck</span>
          </div>
          <h1 className="text-6xl md:text-[5.5rem] font-black text-white tracking-tighter uppercase italic leading-[0.85]">
            Distinguished<br />
            <span className="premium-gradient-text">Benefits</span>
          </h1>
          <p className="text-white/40 text-xl font-medium max-w-lg italic mt-4">
            Curated financial privileges for our esteemed clientele. Enhance your next expedition.
          </p>
        </div>
        
        <Link href="/search">
          <Button variant="premium" className="rounded-full h-16 px-10 shadow-2xl uppercase tracking-[0.2em] font-bold text-xs">
            <Search className="mr-3 size-5" /> Redeem Now
          </Button>
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-8 md:grid-cols-2">
        {offers.map((offer, index) => (
          <div key={offer.code} className="reveal-up scroll-reveal group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 to-accent/0 rounded-[3rem] blur opacity-0 group-hover:opacity-20 group-hover:from-primary group-hover:to-accent transition duration-700" />
            
            <div className="relative glass-dark border border-white/5 rounded-[3rem] p-10 h-full flex flex-col justify-between transition-all duration-500 overflow-hidden group-hover:border-white/10">
              <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity duration-700">
                <Wallet className="size-48" />
              </div>
              
              <div className="relative z-10 space-y-6 flex-1">
                <Badge variant="outline" className="px-5 py-2 rounded-xl border-accent/20 bg-accent/5 text-accent font-bold uppercase tracking-[0.2em] text-[10px]">
                  {offer.code}
                </Badge>
                
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase">{offer.title}</h3>
                  <p className="text-lg text-white/50 leading-relaxed font-medium">{offer.details}</p>
                </div>
              </div>

              <div className="relative z-10 pt-10 mt-10 border-t border-white/5 flex items-center justify-between">
                <Button variant="ghost" className="text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-bold">
                  <Copy className="mr-2 size-4" /> Copy Code
                </Button>
                
                <Link href="/search">
                  <Button variant="ghost" className="text-accent hover:bg-accent/10 rounded-xl hover:text-accent group/btn">
                    Apply <ArrowRight className="ml-2 size-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

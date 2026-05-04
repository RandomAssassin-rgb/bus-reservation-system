"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles, Copy, Search, ArrowRight, Wallet } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const offers = [
  { code: "ELITE300", title: "Complimentary Upgrade", details: "Receive INR 300 instant credit on your next premium AC or Sleeper reservation." },
  { code: "METROVIP", title: "Metropolitan Route Privilege", details: "Exclusive cashback for active business corridors connecting major hubs." },
  { code: "WEEKENDER", title: "Weekend Leisure Credit", details: "Extra wallet benefits applied automatically for Friday-Sunday expeditions." },
  { code: "BLACKCARD", title: "Partner Integration", details: "Maximized limits and exclusive seating rows for partnered luxury cardholders." },
];

export default function OffersPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger);
      
      const ctx = gsap.context(() => {
        // 1. Header Reveal
        gsap.fromTo(".offers-header > *", 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power3.out", clearProps: "all" }
        );

        // 2. Staggered Card Reveal
        gsap.fromTo(".offer-card", 
          { y: 60, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            stagger: 0.2, 
            ease: "power3.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: ".offers-grid",
              start: "top 90%",
            }
          }
        );

        // 3. Section Skew (Butter Smooth)
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".scroll-reveal", "skewY", "deg"),
            clamp = gsap.utils.clamp(-0.5, 0.5);

        ScrollTrigger.create({
          onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -1000);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.8,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
              });
            }
          }
        });
      }, containerRef);

      return () => ctx.revert();
    } catch (err) {
      console.warn("Offers animations bypassed.");
    }
  }, []);

  const copyToClipboard = (code: string, e: React.MouseEvent) => {
    navigator.clipboard.writeText(code);
    const btn = e.currentTarget as HTMLButtonElement;
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span className="text-accent animate-pulse">Copied!</span>`;
    setTimeout(() => {
      btn.innerHTML = originalText;
    }, 2000);
  };

  return (
    <main ref={containerRef} className="mx-auto max-w-7xl px-4 py-24 min-h-screen overflow-hidden">
      {/* Cinematic Header */}
      <div className="offers-header scroll-reveal mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
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
          <Button variant="premium" className="rounded-full h-16 px-10 shadow-2xl uppercase tracking-[0.2em] font-bold text-xs btn-premium">
            <Search className="mr-3 size-5" /> Redeem Now
          </Button>
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid gap-8 md:grid-cols-2 offers-grid">
        {offers.map((offer, index) => (
          <div key={offer.code} className="offer-card scroll-reveal group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/0 to-accent/0 rounded-[3rem] blur opacity-0 group-hover:opacity-20 group-hover:from-primary group-hover:to-accent transition duration-700" />
            
            <div className="relative glass-dark border border-white/5 rounded-[3rem] p-10 h-full flex flex-col justify-between transition-all duration-500 overflow-hidden group-hover:border-white/10 card-lift glass-shine deck-card">
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
                <Button 
                  variant="ghost" 
                  onClick={(e) => copyToClipboard(offer.code, e)}
                  className="text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-bold"
                >
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

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StickySearch } from "@/components/home/sticky-search";
import { OfferCarousel } from "@/components/home/offer-carousel";
import { RouteChips } from "@/components/home/route-chips";
import { BusFront, Sparkles, ShieldCheck, ArrowRight, Zap } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const timeout = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Hero Entrance
        gsap.from(".hero-content > *", {
          y: 60,
          opacity: 0,
          duration: 1.5,
          stagger: 0.3,
          ease: "power4.out",
        });

        // Background parallax
        gsap.to(".parallax-bg", {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-section",
            start: "top top",
            end: "bottom top",
            scrub: true,
          }
        });
      }, containerRef);
      return () => ctx.revert();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background">
      {/* Cinematic Hero Section - Spans Full Screen */}
      <section className="hero-section relative h-[100vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Layers */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2400&q=80"
            alt="Premium Bus"
            fill
            className="object-cover opacity-50 scale-110 parallax-bg"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-80" />
          
          {/* Animated Glow Orbs */}
          <div className="absolute top-1/4 left-1/4 size-[600px] bg-primary/10 rounded-full blur-[180px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 size-[500px] bg-accent/5 rounded-full blur-[150px] animate-pulse [animation-delay:2s]" />
        </div>

        {/* Hero Content */}
        <div className="hero-content relative z-10 w-full max-w-[1400px] px-8 text-center space-y-12">
          <div className="space-y-8">
            <Badge variant="premium" className="px-6 py-2 text-sm rounded-full tracking-[0.3em] uppercase italic bg-white/5 border-white/10 text-primary">
              <Sparkles className="mr-2 size-4 fill-primary" /> The Zenith of Bus Travel
            </Badge>
            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] text-white italic uppercase italic">
              Expedition<br />
              <span className="premium-gradient-text">Without Limits</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed italic">
              Experience the nation&apos;s most elite fleet of luxury coaches. 
              Designed for the distinguished explorer.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 pt-8">
            <Link href="/search">
              <Button size="lg" className="h-[90px] px-16 rounded-[2.5rem] text-2xl font-bold btn-premium shadow-[0_20px_50px_rgba(var(--primary-rgb),0.3)] bg-primary hover:bg-primary/90 transition-all">
                Find Expedition <ArrowRight className="ml-3 size-8" />
              </Button>
            </Link>
            <Link href="/offers">
              <Button variant="outline" size="lg" className="h-[90px] px-16 rounded-[2.5rem] text-2xl font-bold bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/70">
                Member Benefits
              </Button>
            </Link>
          </div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20">
           <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Scroll to Explore</p>
           <div className="w-[1px] h-20 bg-gradient-to-b from-white/20 to-transparent" />
        </div>
      </section>

      {/* Floating Island Search - Overlays Transition */}
      <div className="relative z-30 -mt-20 px-8">
        <StickySearch />
      </div>

      {/* Main Content Area */}
      <section className="py-40 px-8 max-w-[1500px] mx-auto space-y-48">
        
        {/* Featured Routes Section */}
        <div className="space-y-16">
          <div className="scroll-reveal flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/5 pb-12">
            <div className="space-y-4">
              <p className="text-primary text-sm font-bold uppercase tracking-[0.4em]">Strategic Corridors</p>
              <h2 className="text-6xl font-black text-white tracking-tighter italic uppercase">Premier Schedules</h2>
            </div>
            <RouteChips />
          </div>
          
          <div className="scroll-reveal grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              { from: "Kolkata", to: "Durgapur", time: "06:00 AM", price: "799", img: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80" },
              { from: "Mumbai", to: "Pune", time: "09:30 AM", price: "999", img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80" },
              { from: "Delhi", to: "Jaipur", time: "11:00 PM", price: "1499", img: "https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=800&q=80" },
            ].map((route, i) => (
              <div key={i} className="group relative h-[500px] rounded-[3rem] overflow-hidden glass-dark border border-white/5 hover:border-primary/20 transition-all duration-700">
                <Image src={route.img} alt={route.to} fill className="object-cover opacity-40 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                   <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{route.time} • Daily</p>
                   <h3 className="text-4xl font-black text-white italic mb-1 uppercase tracking-tighter">{route.from} → {route.to}</h3>
                   <div className="flex items-center justify-between mt-6">
                      <p className="text-2xl font-bold text-primary">₹{route.price}</p>
                      <Link href="/search">
                        <Button variant="ghost" className="rounded-xl px-6 text-xs font-bold uppercase hover:bg-primary/20">Secure Seat</Button>
                      </Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Showcase Section */}
        <div className="scroll-reveal glass-dark border-white/5 rounded-[4rem] overflow-hidden grid lg:grid-cols-2 shadow-2xl">
           <div className="p-20 space-y-12">
              <div className="size-20 rounded-[2.5rem] bg-accent/20 flex items-center justify-center border border-accent/20">
                <Zap className="size-10 text-accent" />
              </div>
              <div className="space-y-6">
                <h3 className="text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.8]">Peak Performance<br /><span className="text-accent underline decoration-white/10">Orchestrated.</span></h3>
                <p className="text-2xl text-white/30 leading-relaxed max-w-md font-medium italic">Our proprietary transit engine ensures the most efficient journey paths across the subcontinent.</p>
              </div>
              <ul className="space-y-8">
                {[
                  "On-board Luxury Concierge",
                  "Climate-Optimized Cabins",
                  "Zero-Detour Express Paths",
                  "Verified Fleet Operators"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-6 text-white text-xl font-bold group">
                    <div className="size-3 rounded-full bg-accent animate-pulse" /> {item}
                  </li>
                ))}
              </ul>
           </div>
           <div className="relative h-[700px] lg:h-auto overflow-hidden">
              <Image 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80"
                alt="Onboard experience"
                fill
                className="object-cover scale-110 hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/20 to-background" />
           </div>
        </div>

        {/* Privilege Program Carousel */}
        <div className="space-y-16">
          <div className="text-center space-y-4">
             <p className="text-accent text-sm font-bold uppercase tracking-[0.4em]">Distinguished Benefits</p>
             <h2 className="text-7xl font-black text-white tracking-tighter italic uppercase">The Privilege Deck</h2>
          </div>
          <div className="scroll-reveal">
             <OfferCarousel />
          </div>
        </div>

      </section>

      {/* Epic Footer Banner */}
      <section className="scroll-reveal relative h-[600px] w-full overflow-hidden flex items-center justify-center text-center">
        <Image 
          src="https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=2400&q=80"
          alt="Luxury travel background"
          fill
          className="object-cover brightness-50 parallax-bg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background" />
        <div className="relative z-10 space-y-10 px-8">
           <h2 className="text-8xl md:text-[10rem] font-black text-white italic uppercase tracking-tighter leading-[0.8] opacity-20">UNLIMITED</h2>
           <div className="space-y-4">
             <h2 className="text-6xl font-black text-white italic uppercase tracking-tighter">Beyond the Horizon</h2>
             <p className="text-2xl text-white/40 max-w-2xl mx-auto font-medium italic">Join the global elite who demand more from their surface expeditions.</p>
           </div>
           <Link href="/auth/signup">
             <Button variant="premium" className="h-20 px-16 rounded-[2rem] text-xl font-black uppercase tracking-[0.2em] shadow-[0_30px_70px_rgba(var(--primary-rgb),0.5)]">
               Apply for Elite Access
             </Button>
           </Link>
        </div>
      </section>
    </div>
  );
}

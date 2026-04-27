"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const offers = [
  { code: "ELITE300", title: "Elite Member Discount: Save ₹300", subtitle: "Experience luxury for less" },
  { code: "NIGHTEXP", title: "Premium Sleeper Specials", subtitle: "20% off on overnight routes" },
  { code: "FIRSTCLASS", title: "Complimentary Flexi-Ticket", subtitle: "Free rescheduling on selected routes" },
];

export function OfferCarousel() {
  const [index, setIndex] = useState(0);
  const current = useMemo(() => offers[index], [index]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative group overflow-hidden rounded-2xl bg-white/5 border border-white/5 p-6 backdrop-blur-sm">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Ticket className="size-20 -rotate-12" />
      </div>
      
      <div className="relative flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 mb-3 px-3 py-1">Featured Offer</Badge>
          <h3 className="text-xl font-bold text-white tracking-tight leading-tight">{current.title}</h3>
          <p className="mt-2 text-sm text-white/40">
            {current.subtitle} • Use code <span className="text-primary font-mono font-bold tracking-widest">{current.code}</span>
          </p>
        </div>
        
        <div className="flex gap-1 ml-4 self-end">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIndex((i) => (i - 1 + offers.length) % offers.length)} 
            className="size-8 rounded-full border border-white/5 hover:bg-white/10"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => setIndex((i) => (i + 1) % offers.length)} 
            className="size-8 rounded-full border border-white/5 hover:bg-white/10"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="flex gap-1 mt-6">
        {offers.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-primary" : "w-1.5 bg-white/10"}`} 
          />
        ))}
      </div>
    </div>
  );
}

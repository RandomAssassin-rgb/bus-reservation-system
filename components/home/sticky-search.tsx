"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, Calendar, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StickySearch() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        scrolled 
          ? "fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-7xl px-8" 
          : "relative w-full max-w-7xl mx-auto px-8"
      }`}
    >
      <form 
        action="/search" 
        className={`glass-darker border border-white/5 p-3 rounded-[2.5rem] shadow-2xl transition-all duration-500 flex flex-col md:flex-row items-center gap-4 ${
          scrolled ? "h-20" : "p-6"
        }`}
      >
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
              <MapPin className="size-5" />
            </div>
            <Input 
              name="from" 
              placeholder="Origin Expedition Point" 
              className="h-14 rounded-2xl bg-white/5 border-white/5 pl-14 text-lg font-medium placeholder:text-white/20 focus:bg-white/10" 
              required 
            />
          </div>
          <div className="relative group">
            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
              <MapPin className="size-5" />
            </div>
            <Input 
              name="to" 
              placeholder="Destination Terminal" 
              className="h-14 rounded-2xl bg-white/5 border-white/5 pl-14 text-lg font-medium placeholder:text-white/20 focus:bg-white/10" 
              required 
            />
          </div>
        </div>

        <div className="relative w-full md:w-auto min-w-[220px]">
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary">
            <Calendar className="size-5" />
          </div>
          <Input 
            name="date" 
            type="date" 
            className="h-14 rounded-2xl bg-white/5 border-white/5 pl-14 text-lg font-medium focus:bg-white/10" 
            required 
          />
        </div>

        <Button 
          type="submit" 
          variant="premium" 
          className="h-14 md:h-14 px-12 rounded-[1.5rem] text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
        >
          <Search className="size-5 mr-3" />
          Search
        </Button>
      </form>
    </div>
  );
}

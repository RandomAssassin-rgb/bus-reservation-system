"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function StickySearch() {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = document.getElementById("hero-search-anchor");
    if (!el) return;
    sentinelRef.current = el as HTMLDivElement;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={[
        "fixed left-1/2 top-[86px] z-40 w-[min(1000px,calc(100vw-1rem))] -translate-x-1/2 transition-all duration-300",
        visible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <form action="/search" className="premium-card flex items-center gap-2 rounded-2xl bg-white p-2 shadow-2xl">
        <Input name="from" placeholder="From city" className="h-11 rounded-xl border-zinc-200" required />
        <Input name="to" placeholder="To city" className="h-11 rounded-xl border-zinc-200" required />
        <Input name="date" type="date" className="h-11 rounded-xl border-zinc-200" required />
        <Button type="submit" className="h-11 rounded-xl bg-[#d84e55] px-5 hover:bg-[#c63f46]">
          <Search className="mr-2 size-4" />
          Search
        </Button>
      </form>
    </div>
  );
}

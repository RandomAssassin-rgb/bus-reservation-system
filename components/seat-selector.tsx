"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Armchair } from "lucide-react";

type Props = {
  totalSeats: number;
  bookedSeats: number[];
  onChange: (seats: number[]) => void;
};

export function SeatSelector({ totalSeats, bookedSeats, onChange }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const seats = useMemo(() => Array.from({ length: totalSeats }, (_, i) => i + 1), [totalSeats]);

  function toggleSeat(seat: number) {
    if (bookedSeats.includes(seat)) return;
    const next = selected.includes(seat) ? selected.filter((s) => s !== seat) : [...selected, seat];
    setSelected(next);
    onChange(next);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-6 text-xs uppercase tracking-widest font-bold text-white/30">
        <span className="flex items-center gap-2"><span className="inline-block size-3 rounded-sm border border-white/10 bg-white/5" /> Available</span>
        <span className="flex items-center gap-2"><span className="inline-block size-3 rounded-sm bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" /> Selected</span>
        <span className="flex items-center gap-2"><span className="inline-block size-3 rounded-sm bg-white/10" /> Occupied</span>
      </div>
      
      <div className="glass-darker p-8 rounded-[2rem] border-white/5">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {seats.map((seat) => {
            const booked = bookedSeats.includes(seat);
            const active = selected.includes(seat);
            return (
              <button
                key={seat}
                type="button"
                onClick={() => toggleSeat(seat)}
                disabled={booked}
                className={cn(
                  "relative h-12 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1",
                  "border border-white/5 bg-white/5 text-white/40 hover:border-white/20 hover:bg-white/10",
                  booked && "opacity-20 cursor-not-allowed bg-transparent border-transparent text-transparent",
                  active && "border-primary bg-primary/20 text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)] scale-105"
                )}
              >
                {!booked && <Armchair className={cn("size-3", active ? "text-primary" : "text-white/20")} />}
                {!booked ? seat : ""}
                {active && <span className="absolute -top-1 -right-1 size-2 bg-primary rounded-full animate-pulse" />}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-white/40">Total Capacity: <span className="text-white font-bold">{totalSeats}</span></p>
        <p className="text-sm text-white/40 italic">Pick your preferred viewpoint</p>
      </div>
    </div>
  );
}

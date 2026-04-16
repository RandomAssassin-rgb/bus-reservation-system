"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-sm text-zinc-600">
        <span className="flex items-center gap-1"><span className="inline-block size-3 rounded border bg-white" /> Available</span>
        <span className="flex items-center gap-1"><span className="inline-block size-3 rounded bg-[#d84e55]" /> Selected</span>
        <span className="flex items-center gap-1"><span className="inline-block size-3 rounded bg-zinc-300" /> Booked</span>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {seats.map((seat) => {
          const booked = bookedSeats.includes(seat);
          const active = selected.includes(seat);
          return (
            <Button
              key={seat}
              type="button"
              onClick={() => toggleSeat(seat)}
              disabled={booked}
              variant="outline"
              className={cn(
                "h-11 rounded-lg text-[0.95rem] transition-transform hover:scale-[1.03]",
                booked && "cursor-not-allowed bg-zinc-200 text-zinc-400",
                active && "border-[#d84e55] bg-[#d84e55] text-white",
              )}
            >
              {seat}
            </Button>
          );
        })}
      </div>
      <p className="text-base text-zinc-600">Selected seats: {selected.length ? selected.join(", ") : "None"}</p>
    </div>
  );
}

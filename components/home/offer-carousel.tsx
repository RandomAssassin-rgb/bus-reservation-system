"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const offers = [
  { code: "FESTIVE300", title: "Save up to Rs 300 on bus tickets", subtitle: "Valid till 30 Apr · Bus" },
  { code: "SUPERHIT", title: "Flat discount on popular routes", subtitle: "Valid till 30 Apr · AC buses" },
  { code: "CASH300", title: "Weekend cashback offer", subtitle: "Valid till 30 Apr · UPI payments" },
  { code: "HDFC500", title: "Save big with partner banks", subtitle: "Valid till 30 Apr · Cards" },
];

export function OfferCarousel() {
  const [index, setIndex] = useState(0);
  const current = useMemo(() => offers[index], [index]);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % offers.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  function prev() {
    setIndex((i) => (i - 1 + offers.length) % offers.length);
  }

  function next() {
    setIndex((i) => (i + 1) % offers.length);
  }

  return (
    <div className="reveal-up premium-card relative overflow-hidden border border-[#ececec] bg-gradient-to-r from-[#fff3df] to-[#ffe9e9] p-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.6),transparent_45%)]" />
      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="relative flex items-center justify-between gap-3 p-5">
          <Button size="icon-sm" variant="ghost" onClick={prev} className="rounded-full">
            <ChevronLeft className="size-4" />
          </Button>
          <div className="min-w-0 flex-1 text-center">
            <Badge className="bg-zinc-800 text-[10px]">Bus</Badge>
            <p className="mt-2 text-sm font-semibold text-zinc-900">{current.title}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {current.subtitle} · code <span className="font-semibold">{current.code}</span>
            </p>
          </div>
          <Button size="icon-sm" variant="ghost" onClick={next} className="rounded-full">
            <ChevronRight className="size-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

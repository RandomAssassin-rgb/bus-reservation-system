"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const routes = [
  "Kolkata → Durgapur",
  "Delhi → Jaipur",
  "Bangalore → Chennai",
  "Mumbai → Pune",
  "Hyderabad → Vijayawada",
  "Pune → Goa",
  "Kolkata → Siliguri",
  "Ahmedabad → Udaipur",
];

export function RouteChips() {
  return (
    <div className="reveal-up">
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-4 pr-6">
        {routes.map((route) => {
          const [from, to] = route.split(" → ");
          return (
            <Link
              key={route}
              href={`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
              className="group whitespace-nowrap rounded-2xl border border-white/5 bg-white/5 px-6 py-3 text-sm font-medium text-white/50 transition-all duration-300 hover:border-primary/50 hover:bg-primary/5 hover:text-white flex items-center gap-2"
            >
              <span>{from}</span>
              <ArrowRight className="size-3 text-white/20 group-hover:text-primary transition-colors" />
              <span>{to}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

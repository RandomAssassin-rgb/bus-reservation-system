"use client";

import Link from "next/link";

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
      <h3 className="mb-3 text-xl font-semibold text-zinc-900">Quick route picks</h3>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2 pr-6">
        {routes.map((route) => {
          const [from, to] = route.split(" → ");
          return (
            <Link
              key={route}
              href={`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
              className="whitespace-nowrap rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-[0.95rem] text-zinc-700 transition hover:-translate-y-0.5 hover:border-[#d84e55] hover:text-[#d84e55]"
            >
              {route}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

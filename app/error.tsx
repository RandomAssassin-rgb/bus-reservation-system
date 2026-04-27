"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="tf-container flex flex-1 flex-col items-center justify-center gap-6 py-32 text-center bg-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 m-8">
      <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 mb-4">
        <span className="text-4xl text-red-500">⚠</span>
      </div>
      <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">System Interruption</h2>
      <div className="bg-white/5 p-6 rounded-2xl border border-white/5 max-w-md">
        <p className="text-xs font-mono text-red-400 break-all">{error.message || "Unknown connectivity failure"}</p>
      </div>
      <p className="max-w-xl text-white/40 font-medium italic">TransitFlow Elite encountered a synchronization issue. Our technicians are investigating.</p>
      <div className="flex gap-4">
        <Button onClick={reset} variant="premium" className="px-8">Retry Expedition</Button>
        <Button onClick={() => window.location.href='/'} variant="outline" className="border-white/10">Return to Terminal</Button>
      </div>
    </main>
  );
}

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
    <main className="tf-container flex flex-1 flex-col items-center justify-center gap-4 py-16 text-center">
      <h2 className="text-3xl font-bold">Something went wrong</h2>
      <p className="max-w-xl text-zinc-600">We hit an unexpected issue while loading this page. Please try again.</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}

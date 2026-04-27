"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollEffects() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const contextRef = useRef<gsap.Context | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    gsap.registerPlugin(ScrollTrigger);

    const initGSAP = () => {
      /* Temporarily disabled for diagnostics 
      if (contextRef.current) contextRef.current.revert();
      contextRef.current = gsap.context(() => {
        // ... (animation code)
      });
      */
    };

    // Attempt immediately
    initGSAP();

    // Watchdog: If elements haven't appeared yet, try again in 500ms
    const watchdog = setTimeout(initGSAP, 500);

    return () => {
      clearTimeout(watchdog);
      if (contextRef.current) contextRef.current.revert();
    };
  }, [mounted, pathname]);

  return null;
}

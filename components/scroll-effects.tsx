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
      if (contextRef.current) contextRef.current.revert();

      contextRef.current = gsap.context(() => {
        const revealItems = gsap.utils.toArray<HTMLElement>(".scroll-reveal");
        
        if (revealItems.length === 0) return;

        revealItems.forEach((item) => {
          gsap.fromTo(
            item,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 95%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        const parallaxItems = gsap.utils.toArray<HTMLElement>(".parallax-bg");
        parallaxItems.forEach((item) => {
          gsap.to(item, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              scrub: true,
            },
          });
        });

        ScrollTrigger.refresh();
      });
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

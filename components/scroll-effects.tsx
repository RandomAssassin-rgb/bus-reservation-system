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

    // 1. Kill any existing context before starting new one
    if (contextRef.current) {
      contextRef.current.revert();
    }

    // 2. Small delay to let the DOM settle after Next.js transition
    const timeout = setTimeout(() => {
      contextRef.current = gsap.context(() => {
        // Fade reveal up
        const revealItems = gsap.utils.toArray<HTMLElement>(".scroll-reveal");
        revealItems.forEach((item) => {
          gsap.fromTo(
            item,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              ease: "power4.out",
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            },
          );
        });

        // Parallax background
        const parallaxItems = gsap.utils.toArray<HTMLElement>(".parallax-bg");
        parallaxItems.forEach((item) => {
          gsap.fromTo(item, 
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: item,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          );
        });

        // Magnet effect for elite buttons
        const magnetButtons = gsap.utils.toArray<HTMLElement>(".btn-premium");
        magnetButtons.forEach((btn) => {
          btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3 });
          });
          btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
          });
        });

        // Force a global refresh for ScrollTrigger
        ScrollTrigger.refresh();
      }); 
    }, 100);

    return () => {
      clearTimeout(timeout);
      if (contextRef.current) {
        contextRef.current.revert();
      }
    };
  }, [mounted, pathname]);

  return null;
}

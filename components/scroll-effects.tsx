"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollEffects() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    gsap.registerPlugin(ScrollTrigger);

    // Yield to the browser to ensure React 18 completes full DOM hydration
    // before GSAP starts injecting style properties into the DOM.
    const timeout = setTimeout(() => {
      let ctx = gsap.context(() => {
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
      }); // End of gsap.context

      return () => {
        ctx.revert();
      };
    }, 150);

    return () => {
      clearTimeout(timeout);
    };
  }, [mounted, pathname]);

  return null;
}

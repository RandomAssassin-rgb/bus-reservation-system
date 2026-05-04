"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SearchAnimations() {
  useEffect(() => {
    try {
      gsap.registerPlugin(ScrollTrigger);
      
      const ctx = gsap.context(() => {
        // 1. Header Reveal
        gsap.fromTo(".search-header", 
          { y: -30, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "all" }
        );

        // 2. Filter Bar Reveal
        gsap.fromTo(".filter-bar", 
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power3.out", clearProps: "all" }
        );

        // 3. Staggered Results Reveal
        gsap.fromTo(".result-card", 
          { y: 50, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.1, 
            ease: "power2.out",
            clearProps: "all",
            scrollTrigger: {
              trigger: ".results-list",
              start: "top 90%",
            }
          }
        );

        // 4. Global Skew Effect
        let proxy = { skew: 0 },
            skewSetter = gsap.quickSetter(".scroll-reveal", "skewY", "deg"),
            clamp = gsap.utils.clamp(-0.5, 0.5);

        ScrollTrigger.create({
          onUpdate: (self) => {
            let skew = clamp(self.getVelocity() / -1000);
            if (Math.abs(skew) > Math.abs(proxy.skew)) {
              proxy.skew = skew;
              gsap.to(proxy, {
                skew: 0,
                duration: 0.8,
                ease: "power3",
                overwrite: true,
                onUpdate: () => skewSetter(proxy.skew)
              });
            }
          }
        });
      });

      return () => ctx.revert();
    } catch (err) {
      console.warn("Search animations bypassed.");
    }
  }, []);

  return null;
}

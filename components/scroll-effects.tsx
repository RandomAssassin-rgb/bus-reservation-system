"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function ScrollEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const revealItems = gsap.utils.toArray<HTMLElement>(".reveal-up");
    revealItems.forEach((item) => {
      gsap.fromTo(
        item,
        { y: 34, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
          },
        },
      );
    });

    const parallaxItems = gsap.utils.toArray<HTMLElement>(".parallax-bg");
    parallaxItems.forEach((item) => {
      gsap.to(item, {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return null;
}

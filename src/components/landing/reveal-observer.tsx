"use client";

import { useEffect } from "react";

/**
 * Progressive-enhancement scroll reveals for the landing page.
 *
 * The page itself stays a server component; this renders nothing and only
 * adds classes to elements marked with [data-reveal]:
 *  - "ax-pre" (hidden / un-drawn state) is applied via JS, never in markup,
 *    so the page is fully visible without JavaScript.
 *  - "ax-in" replaces it once the element enters the viewport (fires once).
 *
 * Respects prefers-reduced-motion: with `reduce` set, nothing is touched and
 * the page is completely static.
 */
export function RevealObserver() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const els = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (els.length === 0) return;

    for (const el of els) {
      const delay = el.dataset.revealDelay;
      if (delay) el.style.transitionDelay = `${delay}ms`;
      el.classList.add("ax-pre");
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.classList.remove("ax-pre");
          el.classList.add("ax-in");
          io.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, []);

  return null;
}

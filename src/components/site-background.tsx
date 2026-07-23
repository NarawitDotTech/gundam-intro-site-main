"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed page backdrop: blueprint grid, film grain, and a soft
 * spotlight that eases toward the pointer (fine pointers only).
 */
export function SiteBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = spotlightRef.current;
    if (!element) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduceMotion || !finePointer) return;

    const position = { x: window.innerWidth / 2, y: window.innerHeight * 0.22 };
    const target = { ...position };
    let rafId = 0;

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
    };

    const tick = () => {
      position.x += (target.x - position.x) * 0.075;
      position.y += (target.y - position.y) * 0.075;
      element.style.setProperty("--sx", `${position.x.toFixed(1)}px`);
      element.style.setProperty("--sy", `${position.y.toFixed(1)}px`);
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute inset-0 bg-ink-950" />
      <div className="bg-grid absolute inset-0" />
      <div ref={spotlightRef} className="spotlight absolute inset-0" />
      <div className="noise absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-ink-950 to-transparent" />
    </div>
  );
}

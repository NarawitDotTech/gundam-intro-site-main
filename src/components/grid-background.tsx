"use client";

import { useEffect, useRef } from "react";

/**
 * Faint drafting grid behind the page. Near the mouse, a copy of the grid
 * in the signal color shows through a soft radial mask, so the lines glow
 * where you hover. The glow is mouse/trackpad only and respects reduced motion.
 */
export function GridBackground() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glow = glowRef.current;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      document.documentElement.dataset.motion !== "force";
    if (!glow || !finePointer || reduceMotion) return;

    const target = { x: -1000, y: -1000 };
    const pos = { ...target };
    let raf = 0;

    const tick = () => {
      // Ease toward the pointer so the glow trails slightly.
      pos.x += (target.x - pos.x) * 0.18;
      pos.y += (target.y - pos.y) * 0.18;
      glow.style.setProperty("--gx", `${pos.x.toFixed(1)}px`);
      glow.style.setProperty("--gy", `${pos.y.toFixed(1)}px`);
      raf = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (target.x === -1000) {
        pos.x = event.clientX;
        pos.y = event.clientY;
      }
      target.x = event.clientX;
      target.y = event.clientY;
      glow.dataset.active = "true";
    };
    const onLeave = () => (glow.dataset.active = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="grid-bg">
      <div className="grid-bg-lines" />
      <div ref={glowRef} className="grid-bg-glow" data-active="false" />
    </div>
  );
}

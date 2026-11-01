"use client";

import { useEffect, useRef } from "react";

/**
 * Faint drafting grid behind the top of the page that fades out downward. Near the mouse, a copy of the grid
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

    const pointer = { x: -1000, y: -1000 };
    const aim = () => {
      // The grid scrolls with the page, so convert to page coordinates.
      target.x = pointer.x;
      target.y = pointer.y + window.scrollY;
    };
    const onMove = (event: PointerEvent) => {
      const first = pointer.x === -1000;
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      aim();
      if (first) {
        pos.x = target.x;
        pos.y = target.y;
      }
      glow.dataset.active = "true";
    };
    const onLeave = () => (glow.dataset.active = "false");

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", aim, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", aim);
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

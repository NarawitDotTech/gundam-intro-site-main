"use client";

import { useEffect, useRef, useState } from "react";

type CursorVariant = "default" | "interactive" | "text";

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input[type="checkbox"], input[type="radio"], select, summary';
const TEXT_SELECTOR = 'input[type="text"], input[type="password"], input[type="email"], input[type="search"], textarea, [contenteditable="true"]';

const TRAIL_LIFETIME_MS = 420;
const TRAIL_COLOR = { r: 126, g: 240, b: 221 };

/**
 * Custom pointer: an accent dot with a lagging ring and a short fading
 * comet trail. Enabled only for fine pointers with motion allowed —
 * touch devices and reduced-motion users keep the native cursor.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [isPressed, setIsPressed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    const dot = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };
    const trail: { x: number; y: number; t: number }[] = [];
    let rafId = 0;
    let visible = false;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;

    const resizeCanvas = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resizeCanvas();

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!visible) {
        visible = true;
        dot.x = ring.x = target.x;
        dot.y = ring.y = target.y;
        setIsVisible(true);
      }
    };

    const handlePointerOver = (event: PointerEvent) => {
      const element = event.target instanceof Element ? event.target : null;
      if (!element) return;
      if (element.closest(TEXT_SELECTOR)) {
        setVariant("text");
      } else if (element.closest(INTERACTIVE_SELECTOR)) {
        setVariant("interactive");
      } else {
        setVariant("default");
      }
    };

    const handlePointerDown = () => setIsPressed(true);
    const handlePointerUp = () => setIsPressed(false);
    const handleLeave = () => {
      visible = false;
      setIsVisible(false);
    };

    const tick = () => {
      dot.x += (target.x - dot.x) * 0.55;
      dot.y += (target.y - dot.y) * 0.55;
      ring.x += (target.x - ring.x) * 0.16;
      ring.y += (target.y - ring.y) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }

      if (ctx && canvas) {
        const now = performance.now();
        trail.push({ x: dot.x, y: dot.y, t: now });
        while (trail.length > 0 && now - trail[0].t > TRAIL_LIFETIME_MS) {
          trail.shift();
        }

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (const point of trail) {
          const progress = 1 - (now - point.t) / TRAIL_LIFETIME_MS;
          ctx.beginPath();
          ctx.arc(point.x, point.y, 0.8 + progress * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${TRAIL_COLOR.r}, ${TRAIL_COLOR.g}, ${TRAIL_COLOR.b}, ${(
            progress * 0.28
          ).toFixed(3)})`;
          ctx.fill();
        }
      }

      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerover", handlePointerOver, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("resize", resizeCanvas);
    document.documentElement.addEventListener("pointerleave", handleLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerover", handlePointerOver);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", resizeCanvas);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Lagging ring — translate via JS, scale/styling via CSS classes */}
      <div ref={ringRef} className="absolute top-0 left-0 will-change-transform">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-200 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          } ${
            variant === "interactive"
              ? "h-11 w-11 border-accent-300/70 bg-accent-300/10"
              : variant === "text"
                ? "h-6 w-6 border-accent-300/25"
                : "h-8 w-8 border-accent-300/40"
          } ${isPressed ? "scale-75" : "scale-100"}`}
        />
      </div>

      {/* Leading dot / text caret */}
      <div ref={dotRef} className="absolute top-0 left-0 will-change-transform">
        <div
          className={`-translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out ${
            isVisible ? "opacity-100" : "opacity-0"
          } ${
            variant === "text"
              ? "h-4 w-[2.5px] rounded-full bg-accent-300"
              : "h-1.5 w-1.5 rounded-full bg-accent-300 shadow-[0_0_8px_rgba(126,240,221,0.9)]"
          } ${isPressed ? "scale-150" : "scale-100"}`}
        />
      </div>
    </div>
  );
}

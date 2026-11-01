"use client";

import { useEffect, useRef } from "react";

const TRAIL_MS = 420;
const INTERACTIVE = "a, button, label, [role=button], summary";

type Point = { x: number; y: number; t: number };

/**
 * Crosshair cursor with a fading signal-red trail drawn on a canvas.
 * Only for mouse/trackpad users who haven't asked for reduced motion;
 * text fields keep the native I-beam.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      document.documentElement.dataset.motion !== "force";
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    const ctx = canvas?.getContext("2d");
    if (!finePointer || reduceMotion || !canvas || !cursor || !ctx) return;

    document.documentElement.classList.add("has-custom-cursor");
    const points: Point[] = [];
    const pos = { x: -100, y: -100 };
    let raf = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (event: PointerEvent) => {
      pos.x = event.clientX;
      pos.y = event.clientY;
      points.push({ x: pos.x, y: pos.y, t: performance.now() });
      const target = event.target as Element | null;
      cursor.dataset.state = target?.closest("input, textarea, select")
        ? "text"
        : target?.closest(INTERACTIVE)
          ? "hover"
          : "idle";
    };
    const onDown = () => (cursor.dataset.pressed = "true");
    const onUp = () => (cursor.dataset.pressed = "false");
    const onLeave = () => (cursor.dataset.hidden = "true");
    const onEnter = () => (cursor.dataset.hidden = "false");

    const draw = () => {
      const now = performance.now();
      while (points.length && now - points[0].t > TRAIL_MS) points.shift();

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const color = getComputedStyle(document.documentElement).getPropertyValue("--signal").trim();
      ctx.strokeStyle = color || "#c22d18";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = 1; i < points.length; i++) {
        const life = 1 - (now - points[i].t) / TRAIL_MS;
        ctx.globalAlpha = life * 0.9;
        ctx.lineWidth = 0.5 + life * 3;
        ctx.beginPath();
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-layer">
      <canvas ref={canvasRef} className="cursor-trail" />
      <div ref={cursorRef} className="cursor" data-state="idle">
        <span className="cursor-ring" />
        <span className="cursor-cross" />
      </div>
    </div>
  );
}

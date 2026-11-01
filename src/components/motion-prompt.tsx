"use client";

import { useEffect, useState } from "react";

export const MOTION_KEY = "motion-preference";

/**
 * When the visitor's system asks for reduced motion, offer to turn the
 * site's animations on anyway. The choice is remembered in this browser;
 * "on" makes the inline script in layout.tsx set html[data-motion="force"].
 */
export function MotionPrompt() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(MOTION_KEY);
    } catch {
      return;
    }
    if (!saved && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Defer so the state update happens outside the effect body.
      const id = window.setTimeout(() => setOpen(true), 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  const choose = (value: "on" | "off") => {
    try {
      localStorage.setItem(MOTION_KEY, value);
    } catch {
      /* storage blocked: just close */
    }
    if (value === "on") window.location.reload();
    else setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="motion-prompt-title"
      aria-describedby="motion-prompt-text"
      className="fixed right-5 bottom-5 left-5 z-[90] border border-ink bg-paper p-6 sm:left-auto sm:w-[400px]"
    >
      <p id="motion-prompt-title" className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
        Animations are off
      </p>
      <p id="motion-prompt-text" className="mt-3 text-[15px] leading-relaxed text-ink">
        Your device is set to reduce motion, so this site is hiding its custom cursor and animations.
        Turn them on for this site?
      </p>
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          autoFocus
          onClick={() => choose("on")}
          className="inline-flex h-11 items-center bg-ink px-5 text-[15px] font-semibold text-paper transition-colors duration-150 hover:bg-signal"
        >
          Turn on animations
        </button>
        <button
          type="button"
          onClick={() => choose("off")}
          className="text-[15px] text-muted underline underline-offset-4 hover:text-ink"
        >
          Keep them off
        </button>
      </div>
    </div>
  );
}

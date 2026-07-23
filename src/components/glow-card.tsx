"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

type GlowCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Card with a soft radial highlight that tracks the pointer.
 * The sheen itself is pure CSS (`.sheen`); this only feeds it coordinates.
 */
export function GlowCard({ children, className = "" }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element || event.pointerType === "touch") return;

    const rect = element.getBoundingClientRect();
    element.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    element.style.setProperty("--my", `${event.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={handlePointerMove} className={`sheen ${className}`}>
      {children}
    </div>
  );
}

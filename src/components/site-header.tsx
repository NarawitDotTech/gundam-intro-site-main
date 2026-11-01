"use client";

import { useEffect, useRef, useState } from "react";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

const HIDE_DELAY_MS = 900;
const SHOW_ZONE_PX = 72;

/**
 * Pinned header that slides away a moment after you scroll down,
 * and comes back when you scroll up, reach the top, move the mouse
 * to the top edge, or tab into it.
 */
export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const hideTimer = useRef<number | undefined>(undefined);
  const hovering = useRef(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const show = () => {
      window.clearTimeout(hideTimer.current);
      setHidden(false);
    };
    const scheduleHide = () => {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = window.setTimeout(() => {
        if (!hovering.current && window.scrollY > SHOW_ZONE_PX) setHidden(true);
      }, HIDE_DELAY_MS);
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (y <= SHOW_ZONE_PX || y < lastY - 4) show();
      else if (y > lastY + 4) scheduleHide();
      lastY = y;
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.clientY <= SHOW_ZONE_PX) show();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.clearTimeout(hideTimer.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <header
      data-hidden={hidden}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => (hovering.current = false)}
      onFocus={() => setHidden(false)}
      className="site-header sticky top-0 z-50 border-b border-rule bg-paper"
    >
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <a href="#top" className="font-wide text-[15px] font-extrabold tracking-[0.02em] text-ink uppercase">
          Gundam
        </a>
        <nav aria-label="Primary" className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] text-muted transition-colors duration-150 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

import { marqueeItems } from "@/lib/site";

function MarqueeRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {marqueeItems.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-6 font-mono text-xs tracking-[0.28em] uppercase text-zinc-500">
            {item}
          </span>
          <span className="h-1 w-1 rotate-45 bg-accent-400/50" />
        </span>
      ))}
    </div>
  );
}

/** Slow, pausable capability ticker used as a section divider. */
export function Marquee() {
  return (
    <div className="marquee relative z-10 overflow-hidden border-y border-white/5 bg-ink-900/40 py-4">
      <div className="marquee-track flex w-max">
        <MarqueeRow />
        <MarqueeRow ariaHidden />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-ink-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink-950 to-transparent" />
    </div>
  );
}

import { GlowCard } from "@/components/glow-card";
import { LogoMark } from "@/components/icons";
import type { Project } from "@/lib/projects";

type ProfileCardProps = {
  projects: Project[];
};

/** Schematic-style identity card shown beside the hero copy. */
export function ProfileCard({ projects }: ProfileCardProps) {
  return (
    <GlowCard className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-ink-900/70 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.7)] backdrop-blur-sm">
      {/* Corner brackets */}
      <span aria-hidden="true" className="absolute top-3 left-3 h-3 w-3 border-t-2 border-l-2 border-accent-400/50" />
      <span aria-hidden="true" className="absolute top-3 right-3 h-3 w-3 border-t-2 border-r-2 border-accent-400/50" />
      <span aria-hidden="true" className="absolute bottom-3 left-3 h-3 w-3 border-b-2 border-l-2 border-accent-400/50" />
      <span aria-hidden="true" className="absolute right-3 bottom-3 h-3 w-3 border-r-2 border-b-2 border-accent-400/50" />

      <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
        <div className="flex items-center gap-2 text-accent-300">
          <LogoMark className="h-5 w-5" />
          <span className="font-mono text-[11px] tracking-[0.3em] uppercase">Profile</span>
        </div>
        <span className="font-mono text-[11px] tracking-widest text-zinc-500">ID—001</span>
      </div>

      <div className="relative px-6 pt-8 pb-6">
        {/* Monogram with scanline */}
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-accent-400/30 bg-gradient-to-br from-accent-400/15 via-ink-850 to-ink-900">
          <span className="bg-gradient-to-br from-accent-200 to-accent-500 bg-clip-text text-5xl font-black text-transparent">
            G
          </span>
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-1/2 h-10 animate-scan bg-gradient-to-b from-transparent via-accent-300/15 to-transparent"
          />
        </div>

        <div className="mt-6 text-center">
          <p className="text-lg font-bold tracking-tight text-zinc-100">Narawit “Gundam” Aunsaen</p>
          <p className="mt-1 font-mono text-xs tracking-[0.2em] text-accent-300/90 uppercase">
            Product · Design · Code
          </p>
        </div>

        <dl className="mt-7 grid grid-cols-2 gap-3 border-t border-white/5 pt-6">
          <div className="rounded-xl border border-white/5 bg-ink-850/80 px-4 py-3 text-center">
            <dt className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">Projects</dt>
            <dd className="mt-1 text-xl font-bold text-zinc-100">{projects.length}</dd>
          </div>
          <div className="rounded-xl border border-white/5 bg-ink-850/80 px-4 py-3 text-center">
            <dt className="font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase">Status</dt>
            <dd className="mt-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-accent-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute h-full w-full animate-pulse-ring rounded-full bg-accent-300" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-accent-300" />
              </span>
              Building
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-white/5 px-6 py-3">
        <p className="text-center font-mono text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
          Portfolio — {new Date().getFullYear()}
        </p>
      </div>
    </GlowCard>
  );
}

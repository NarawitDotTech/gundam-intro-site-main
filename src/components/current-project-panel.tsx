import { GlowCard } from "@/components/glow-card";
import { ArrowDownIcon } from "@/components/icons";
import type { Project } from "@/lib/projects";
import { getProgressTone } from "@/lib/site";

type CurrentProjectPanelProps = {
  project: Project;
};

/** Featured "currently building" panel above the full project grid. */
export function CurrentProjectPanel({ project }: CurrentProjectPanelProps) {
  const tone = getProgressTone(project.progress);

  return (
    <GlowCard className="group relative overflow-hidden rounded-3xl border border-accent-400/25 bg-gradient-to-br from-ink-850/90 via-ink-900/80 to-ink-950/90 p-8 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.8)] backdrop-blur-sm sm:p-10">
      {/* Decorative signal bars */}
      <div aria-hidden="true" className="absolute top-8 right-8 hidden items-end gap-1.5 sm:flex">
        {[0.35, 0.6, 0.85, 0.5, 1].map((height, index) => (
          <span
            key={index}
            className="w-1.5 rounded-full bg-accent-400/25 transition-colors duration-500 group-hover:bg-accent-400/60"
            style={{ height: `${height * 44}px` }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.28em] text-accent-300 uppercase">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-pulse-ring rounded-full bg-accent-300" />
            <span className="relative h-2 w-2 rounded-full bg-accent-300" />
          </span>
          Now building
        </span>
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase ${tone.chip}`}
        >
          {project.progress}
        </span>
      </div>

      <h2 className="mt-5 max-w-xl text-2xl font-black tracking-tight text-zinc-50 sm:text-3xl">
        {project.name}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
        {project.description}
      </p>

      <a
        href="#projects"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-accent-400/30 bg-accent-400/10 px-5 py-2.5 text-sm font-semibold text-accent-200 transition-all hover:border-accent-400/60 hover:bg-accent-400/20"
      >
        See all projects
        <ArrowDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
      </a>
    </GlowCard>
  );
}

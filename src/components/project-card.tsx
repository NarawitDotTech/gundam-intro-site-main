import { GlowCard } from "@/components/glow-card";
import { ArrowUpRightIcon } from "@/components/icons";
import type { Project } from "@/lib/projects";
import { formatProjectIndex, getProgressTone } from "@/lib/site";

type ProjectCardProps = {
  project: Project;
  index: number;
};

export function ProjectCard({ project, index }: ProjectCardProps) {
  const tone = getProgressTone(project.progress);

  return (
    <GlowCard
      className={`group relative h-full rounded-2xl border bg-ink-900/70 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.75)] ${
        project.isCurrent
          ? "border-accent-400/35 hover:border-accent-400/60"
          : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-sm text-zinc-600 transition-colors group-hover:text-accent-400">
          {formatProjectIndex(index)}
        </span>
        <div className="flex items-center gap-2">
          {project.isCurrent ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-400/30 bg-accent-400/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] text-accent-200 uppercase">
              <span className="h-1 w-1 rounded-full bg-accent-300" />
              Now
            </span>
          ) : null}
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase ${tone.chip}`}
          >
            <span className={`h-1 w-1 rounded-full ${tone.dot}`} />
            {project.progress}
          </span>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-bold tracking-tight text-zinc-100 transition-colors group-hover:text-accent-200">
        {project.name}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{project.description}</p>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
        <span className="font-mono text-[10px] tracking-[0.25em] text-zinc-600 uppercase">
          Case {formatProjectIndex(index)}
        </span>
        <ArrowUpRightIcon className="h-4 w-4 text-zinc-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-300" />
      </div>
    </GlowCard>
  );
}

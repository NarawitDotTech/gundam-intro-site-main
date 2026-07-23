"use client";

import { CheckIcon, TrashIcon } from "@/components/icons";
import type { Project } from "@/lib/projects";
import { formatProjectIndex, getProgressTone, progressPresets } from "@/lib/site";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-ink-950/70 px-3.5 py-2.5 text-sm text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/15";

type ProjectEditorProps = {
  project: Project;
  index: number;
  isCurrent: boolean;
  deleteArmed: boolean;
  onUpdate: (id: string, field: keyof Project, value: string) => void;
  onSetCurrent: (id: string) => void;
  onArmDelete: (id: string) => void;
  onDelete: (id: string) => void;
};

/** Editable card for a single project inside the admin dashboard. */
export function ProjectEditor({
  project,
  index,
  isCurrent,
  deleteArmed,
  onUpdate,
  onSetCurrent,
  onArmDelete,
  onDelete,
}: ProjectEditorProps) {
  const tone = getProgressTone(project.progress);

  return (
    <article
      id={`project-card-${project.id}`}
      aria-label={`Project ${formatProjectIndex(index)}: ${project.name}`}
      className={`scroll-mt-32 rounded-2xl border bg-ink-900/70 backdrop-blur-sm transition-colors ${
        isCurrent
          ? "border-accent-400/35 shadow-[0_0_0_1px_rgba(79,224,200,0.12),0_20px_50px_-24px_rgba(0,0,0,0.7)]"
          : "border-white/10"
      }`}
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs tracking-[0.22em] text-zinc-500 uppercase">
            Project {formatProjectIndex(index)}
          </span>
          <span
            className={`hidden items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-[0.16em] uppercase sm:inline-flex ${tone.chip}`}
          >
            <span className={`h-1 w-1 rounded-full ${tone.dot}`} />
            {project.progress || "No status"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSetCurrent(project.id)}
            aria-pressed={isCurrent}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              isCurrent
                ? "border-accent-400/50 bg-accent-400/15 text-accent-200"
                : "border-white/10 bg-white/5 text-zinc-400 hover:border-accent-400/40 hover:text-accent-200"
            }`}
          >
            <span
              className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                isCurrent ? "border-accent-300" : "border-zinc-500"
              }`}
            >
              {isCurrent ? <span className="h-1.5 w-1.5 rounded-full bg-accent-300" /> : null}
            </span>
            {isCurrent ? "Current" : "Set current"}
          </button>

          <button
            type="button"
            onClick={() => (deleteArmed ? onDelete(project.id) : onArmDelete(project.id))}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              deleteArmed
                ? "border-rose-400/70 bg-rose-400/25 text-rose-100"
                : "border-rose-300/20 bg-rose-300/5 text-rose-300/90 hover:border-rose-300/40 hover:bg-rose-300/15"
            }`}
          >
            {deleteArmed ? <CheckIcon className="h-3.5 w-3.5" /> : <TrashIcon className="h-3.5 w-3.5" />}
            {deleteArmed ? "Confirm?" : "Delete"}
          </button>
        </div>
      </header>

      <div className="space-y-4 px-5 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor={`project-name-${project.id}`}
              className="mb-1.5 block font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase"
            >
              Name
            </label>
            <input
              id={`project-name-${project.id}`}
              value={project.name}
              onChange={(event) => onUpdate(project.id, "name", event.target.value)}
              placeholder="Project name"
              className={inputClass}
            />
          </div>

          <div>
            <label
              htmlFor={`project-progress-${project.id}`}
              className="mb-1.5 block font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase"
            >
              Progress
            </label>
            <input
              id={`project-progress-${project.id}`}
              value={project.progress}
              onChange={(event) => onUpdate(project.id, "progress", event.target.value)}
              placeholder="e.g. In Progress"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] tracking-[0.22em] text-zinc-600 uppercase">
            Quick set:
          </span>
          {progressPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => onUpdate(project.id, "progress", preset)}
              className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all ${
                project.progress === preset
                  ? "border-accent-400/50 bg-accent-400/15 text-accent-200"
                  : "border-white/10 bg-white/5 text-zinc-400 hover:border-white/25 hover:text-zinc-200"
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        <div>
          <label
            htmlFor={`project-description-${project.id}`}
            className="mb-1.5 block font-mono text-[10px] tracking-[0.22em] text-zinc-500 uppercase"
          >
            Description
          </label>
          <textarea
            id={`project-description-${project.id}`}
            value={project.description}
            onChange={(event) => onUpdate(project.id, "description", event.target.value)}
            rows={3}
            placeholder="What is this project about?"
            className={`${inputClass} resize-y leading-relaxed`}
          />
        </div>
      </div>
    </article>
  );
}

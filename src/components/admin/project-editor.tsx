"use client";

import type { Project } from "@/lib/projects";
import { formatProjectIndex, progressPresets } from "@/lib/site";

export const fieldLabel = "mb-2 block font-mono text-xs tracking-[0.16em] text-muted uppercase";
export const inputClass =
  "w-full border border-rule bg-paper px-3 py-2.5 text-[15px] text-ink outline-none transition-colors duration-150 placeholder:text-muted/70 hover:border-muted focus:border-ink";

type ProjectEditorProps = {
  project: Project;
  index: number;
  deleteArmed: boolean;
  onUpdate: (id: string, field: "name" | "progress" | "description", value: string) => void;
  onSetCurrent: (id: string) => void;
  onArmDelete: (id: string | null) => void;
  onDelete: (id: string) => void;
};

/** One project as a ruled row of form fields. */
export function ProjectEditor({
  project,
  index,
  deleteArmed,
  onUpdate,
  onSetCurrent,
  onArmDelete,
  onDelete,
}: ProjectEditorProps) {
  const id = project.id;

  return (
    <li
      id={`project-row-${id}`}
      className="grid scroll-mt-24 gap-x-8 gap-y-5 border-b border-rule py-8 sm:grid-cols-[4rem_1fr]"
    >
      <div className="flex items-center justify-between sm:block">
        <span className="font-mono text-sm text-muted">{formatProjectIndex(index)}</span>
      </div>

      <fieldset className="min-w-0 space-y-5">
        <legend className="sr-only">Project {formatProjectIndex(index)}</legend>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`name-${id}`} className={fieldLabel}>
              Name
            </label>
            <input
              id={`name-${id}`}
              value={project.name}
              onChange={(event) => onUpdate(id, "name", event.target.value)}
              className={inputClass + " font-semibold"}
            />
          </div>
          <div>
            <label htmlFor={`progress-${id}`} className={fieldLabel}>
              Status
            </label>
            <input
              id={`progress-${id}`}
              value={project.progress}
              onChange={(event) => onUpdate(id, "progress", event.target.value)}
              list={`progress-presets-${id}`}
              className={inputClass}
            />
            <datalist id={`progress-presets-${id}`}>
              {progressPresets.map((preset) => (
                <option key={preset} value={preset} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label htmlFor={`description-${id}`} className={fieldLabel}>
            Description
          </label>
          <textarea
            id={`description-${id}`}
            value={project.description}
            onChange={(event) => onUpdate(id, "description", event.target.value)}
            rows={3}
            className={inputClass + " resize-y leading-relaxed"}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <label className="inline-flex cursor-pointer items-center gap-2.5 text-[15px] text-ink">
            <input
              type="radio"
              name="current-project"
              checked={project.isCurrent}
              onChange={() => onSetCurrent(id)}
              className="h-4 w-4 accent-[var(--signal)]"
            />
            Current project
          </label>

          {deleteArmed ? (
            <span className="inline-flex items-center gap-3">
              <span className="text-[15px] text-ink">Delete “{project.name || "Untitled"}”?</span>
              <button
                type="button"
                onClick={() => onDelete(id)}
                className="h-10 bg-signal px-4 text-[15px] font-semibold text-paper"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => onArmDelete(null)}
                className="h-10 px-2 text-[15px] text-muted underline underline-offset-4 hover:text-ink"
              >
                Keep
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onArmDelete(id)}
              className="h-10 text-[15px] text-muted underline decoration-rule underline-offset-4 transition-colors duration-150 hover:text-signal hover:decoration-signal"
            >
              Delete project
            </button>
          )}
        </div>
      </fieldset>
    </li>
  );
}

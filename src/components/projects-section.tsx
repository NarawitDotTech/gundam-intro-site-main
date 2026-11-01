"use client";

import { useEffect, useState } from "react";
import { defaultProjects, fetchProjects, type Project } from "@/lib/projects";
import { formatProjectIndex } from "@/lib/site";

const label = "font-mono text-xs tracking-[0.16em] text-muted uppercase";

export function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    let cancelled = false;
    void fetchProjects().then((next) => {
      if (!cancelled) setProjects(next);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="work" className="scroll-mt-20 py-16 sm:py-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-wide text-[32px] leading-tight font-extrabold tracking-[-0.01em] text-ink">
          Work
        </h2>
        <p className={label}>
          {projects.length} {projects.length === 1 ? "project" : "projects"}
        </p>
      </div>

      <ol className="mt-10 border-t border-ink">
        {projects.map((project, index) => (
          <li
            key={project.id}
            className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-3 border-b border-rule py-6 sm:grid-cols-[4rem_1fr_11rem] sm:gap-x-8"
          >
            <span className="font-mono text-sm text-muted">{formatProjectIndex(index)}</span>
            <div>
              <h3 className="text-[22px] leading-snug font-bold text-ink">{project.name}</h3>
              {project.description ? (
                <p className="mt-2 max-w-[62ch] text-[15px] leading-relaxed text-muted">
                  {project.description}
                </p>
              ) : null}
            </div>
            <p className="col-start-2 flex items-center gap-2 font-mono text-xs tracking-[0.12em] text-ink uppercase sm:col-start-3 sm:justify-end sm:pt-2">
              {project.isCurrent ? (
                <>
                  <span aria-hidden="true" className="h-2 w-2 bg-signal" />
                  <span className="sr-only">Current project, </span>
                </>
              ) : null}
              {project.progress}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

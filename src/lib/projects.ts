export type Project = {
  id: string;
  name: string;
  progress: string;
  description: string;
  isCurrent: boolean;
};

export const ADMIN_CODE = "252525";

export const defaultProjects: Project[] = [
  {
    id: "project-1",
    name: "Portfolio Website Refresh",
    progress: "In Progress",
    description: "Redesigning my personal site with better interactions and cleaner structure.",
    isCurrent: true,
  },
  {
    id: "project-2",
    name: "Brand Identity Toolkit",
    progress: "Planning",
    description: "Building reusable brand components for social and product visuals.",
    isCurrent: false,
  },
];

function cloneDefaults(): Project[] {
  return defaultProjects.map((project) => ({ ...project }));
}

export function normalizeProjects(value: unknown): Project[] {
  if (!Array.isArray(value)) {
    return cloneDefaults();
  }

  const normalized = value
    .map((item, index) => {
      const typed = item as Partial<Project>;

      return {
        id: typeof typed.id === "string" && typed.id.trim() ? typed.id : `project-${index + 1}`,
        name: typeof typed.name === "string" && typed.name.trim() ? typed.name : `Untitled Project ${index + 1}`,
        progress:
          typeof typed.progress === "string" && typed.progress.trim()
            ? typed.progress
            : "Planning",
        description: typeof typed.description === "string" ? typed.description : "",
        isCurrent: Boolean(typed.isCurrent),
      };
    })
    .filter((item) => item.name.trim().length > 0);

  if (normalized.length === 0) {
    return cloneDefaults();
  }

  if (!normalized.some((item) => item.isCurrent)) {
    normalized[0].isCurrent = true;
  }

  let foundCurrent = false;
  for (const project of normalized) {
    if (project.isCurrent && !foundCurrent) {
      foundCurrent = true;
      continue;
    }

    if (foundCurrent) {
      project.isCurrent = false;
    }
  }

  return normalized;
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch("/api/projects", { cache: "no-store" });
    if (!response.ok) {
      return cloneDefaults();
    }

    const data = (await response.json()) as { projects?: unknown };
    return normalizeProjects(data.projects);
  } catch {
    return cloneDefaults();
  }
}

export async function updateProjects(projects: Project[]): Promise<boolean> {
  try {
    const response = await fetch("/api/projects", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ projects }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

export function getCurrentProject(projects: Project[]): Project {
  const current = projects.find((item) => item.isCurrent);
  return current ?? projects[0] ?? cloneDefaults()[0];
}

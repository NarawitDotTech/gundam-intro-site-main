import type { Project } from "@/lib/projects";

export const introText =
  "I design clear digital experiences and build modern web products with a strong focus on usability, brand consistency, and clean code.";

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
};

export const socialLinks: SocialLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/NarawitDotTech",
    handle: "@NarawitDotTech",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/narawit.aunsaen.5",
    handle: "narawit.aunsaen.5",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/gundamshrkdv?igsh=bmJtMXByMmt5Z3U=",
    handle: "@gundamshrkdv",
  },
];

export const focusAreas = [
  { label: "Design", value: "UI/UX, brand systems" },
  { label: "Build", value: "Web development, motion and interaction" },
  { label: "Stack", value: "React, Next.js, TypeScript" },
  { label: "Elsewhere", value: "GitHub @NarawitDotTech" },
];

export const progressPresets = [
  "Planning",
  "In Progress",
  "On Hold",
  "Completed",
] as const;

export type ProgressTone = {
  dot: string;
  chip: string;
};

/** Map a free-form progress label to a cohesive status color. */
export function getProgressTone(progress: string): ProgressTone {
  const value = progress.toLowerCase();

  if (value.includes("complete") || value.includes("done") || value.includes("launch") || value.includes("ship")) {
    return {
      dot: "bg-emerald-300",
      chip: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
    };
  }

  if (value.includes("progress") || value.includes("build") || value.includes("develop")) {
    return {
      dot: "bg-accent-300",
      chip: "border-accent-300/30 bg-accent-300/10 text-accent-200",
    };
  }

  if (value.includes("hold") || value.includes("pause") || value.includes("block")) {
    return {
      dot: "bg-amber-300",
      chip: "border-amber-300/30 bg-amber-300/10 text-amber-200",
    };
  }

  if (value.includes("plan") || value.includes("design") || value.includes("research")) {
    return {
      dot: "bg-sky-300",
      chip: "border-sky-300/30 bg-sky-300/10 text-sky-200",
    };
  }

  return {
    dot: "bg-zinc-400",
    chip: "border-zinc-400/30 bg-zinc-400/10 text-zinc-300",
  };
}

export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function countCompleted(projects: Project[]): number {
  return projects.filter((project) => {
    const value = project.progress.toLowerCase();
    return (
      value.includes("complete") ||
      value.includes("done") ||
      value.includes("launch") ||
      value.includes("ship")
    );
  }).length;
}

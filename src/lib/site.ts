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

export function formatProjectIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

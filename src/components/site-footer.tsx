import Link from "next/link";
import {
  ArrowUpRightIcon,
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
  LogoMark,
} from "@/components/icons";
import { socialLinks } from "@/lib/site";

const socialIcons = {
  GitHub: GitHubIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
} as const;

export function SiteFooter() {
  return (
    <footer className="relative z-10 border-t border-white/5">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5 text-zinc-400">
          <LogoMark className="h-6 w-6 text-accent-400/80" />
          <p className="font-mono text-xs tracking-wider">
            © {new Date().getFullYear()} Gundam — Built with Next.js
          </p>
        </div>

        <div className="flex items-center gap-2">
          {socialLinks.map((link) => {
            const Icon = socialIcons[link.label as keyof typeof socialIcons];
            return (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`${link.label} profile`}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all hover:-translate-y-0.5 hover:border-accent-400/40 hover:text-accent-300"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
          <Link
            href="/admin"
            className="group ml-2 inline-flex items-center gap-1 rounded-full border border-white/10 px-3.5 py-2 font-mono text-xs text-zinc-500 transition-colors hover:border-accent-400/40 hover:text-accent-300"
          >
            Admin
            <ArrowUpRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

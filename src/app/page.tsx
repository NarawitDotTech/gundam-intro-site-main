"use client";

import { useEffect, useState } from "react";
import { CurrentProjectPanel } from "@/components/current-project-panel";
import {
  ArrowUpRightIcon,
  FacebookIcon,
  GitHubIcon,
  InstagramIcon,
} from "@/components/icons";
import { Marquee } from "@/components/marquee";
import { ProfileCard } from "@/components/profile-card";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SiteBackground } from "@/components/site-background";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { TypingText } from "@/components/typing-text";
import {
  defaultProjects,
  fetchProjects,
  getCurrentProject,
  type Project,
} from "@/lib/projects";
import { introText, roles, socialLinks } from "@/lib/site";

const socialIcons = {
  GitHub: GitHubIcon,
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
} as const;

export default function Home() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);

  useEffect(() => {
    const syncProjects = async () => {
      setProjects(await fetchProjects());
    };

    const handleFocus = () => {
      void syncProjects();
    };

    void syncProjects();
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const currentProject = getCurrentProject(projects);

  return (
    <>
      <SiteBackground />
      <SiteHeader />

      <main className="relative z-10">
        {/* ---------- Hero ---------- */}
        <section className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-6 pt-28 pb-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
            <Reveal>
              <p className="inline-flex items-center gap-2.5 font-mono text-xs tracking-[0.3em] text-accent-300 uppercase">
                <span className="h-px w-8 bg-accent-400/60" />
                Portfolio — {new Date().getFullYear()}
              </p>

              <h1 className="mt-6 text-[clamp(2.6rem,6.5vw,4.6rem)] leading-[1.04] font-black tracking-tight text-zinc-50">
                Hi, I’m Gundam.
                <br />
                <span className="text-zinc-400">I’m </span>
                <TypingText
                  words={roles}
                  className="inline-flex min-w-[7.5ch] items-baseline text-left text-accent-300"
                />
              </h1>

              <p className="mt-7 max-w-xl text-base leading-relaxed text-zinc-400 sm:text-lg">
                {introText}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent-400 px-6 py-3 text-sm font-bold text-ink-950 shadow-[0_8px_30px_-8px_rgba(79,224,200,0.5)] transition-all hover:-translate-y-0.5 hover:bg-accent-300"
                >
                  View my work
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-accent-400/40 hover:text-accent-200"
                >
                  Get in touch
                </a>
              </div>

              <div className="mt-10 flex items-center gap-3">
                {socialLinks.map((link) => {
                  const Icon = socialIcons[link.label as keyof typeof socialIcons];
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${link.label} profile`}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-ink-900/60 text-zinc-400 transition-all hover:-translate-y-1 hover:border-accent-400/50 hover:text-accent-300"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </a>
                  );
                })}
                <span className="ml-1 hidden font-mono text-xs tracking-wider text-zinc-600 sm:inline">
                  Find me elsewhere →
                </span>
              </div>
            </Reveal>

            <Reveal delay={150} className="flex justify-center lg:justify-end">
              <ProfileCard projects={projects} />
            </Reveal>
          </div>

          {/* Scroll cue */}
          <div className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
            <span className="font-mono text-[10px] tracking-[0.35em] text-zinc-600 uppercase">
              Scroll
            </span>
            <span className="h-8 w-px overflow-hidden bg-white/10">
              <span className="block h-3 w-px animate-scroll-cue bg-accent-300" />
            </span>
          </div>
        </section>

        <Marquee />

        {/* ---------- Now building ---------- */}
        <section id="now" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24">
          <Reveal>
            <CurrentProjectPanel project={currentProject} />
          </Reveal>
        </section>

        {/* ---------- Projects ---------- */}
        <section id="projects" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/5 pb-6">
              <div>
                <p className="font-mono text-xs tracking-[0.3em] text-accent-300 uppercase">
                  Selected work
                </p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">
                  Projects
                </h2>
              </div>
              <p className="font-mono text-xs tracking-[0.2em] text-zinc-500 uppercase">
                {projects.length} {projects.length === 1 ? "entry" : "entries"}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {projects.map((project, index) => (
              <Reveal key={project.id} delay={index * 90}>
                <ProjectCard project={project} index={index} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pb-28">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-ink-900/70 px-8 py-14 text-center backdrop-blur-sm sm:px-14">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(79,224,200,0.12),transparent_70%)]"
              />
              <div className="relative">
                <p className="font-mono text-xs tracking-[0.3em] text-accent-300 uppercase">
                  What’s next
                </p>
                <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-black tracking-tight text-zinc-50 sm:text-4xl">
                  Have an idea in mind? Let’s build something worth shipping.
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-zinc-400 sm:text-base">
                  I’m always happy to talk about new projects, collaborations, or
                  interesting problems. Reach out on any of these channels.
                </p>
                <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                  {socialLinks.map((link) => {
                    const Icon = socialIcons[link.label as keyof typeof socialIcons];
                    return (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-white/5 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition-all hover:-translate-y-0.5 hover:border-accent-400/50 hover:text-accent-200"
                      >
                        <Icon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-accent-300" />
                        {link.label}
                        <span className="font-mono text-xs font-normal text-zinc-500">
                          {link.handle}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

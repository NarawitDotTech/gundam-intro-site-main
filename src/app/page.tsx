import { ArrowUpRightIcon } from "@/components/icons";
import { ProjectsSection } from "@/components/projects-section";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { focusAreas, introText, socialLinks } from "@/lib/site";

const label = "font-mono text-xs tracking-[0.16em] text-muted uppercase";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main className="mx-auto w-full max-w-[1120px] px-5 sm:px-8">
        {/* Hero */}
        <section className="grid gap-12 border-b border-rule pt-16 pb-16 sm:pt-24 sm:pb-24 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div>
            <p className={label}>Designer &amp; engineer</p>
            <h1 className="font-wide mt-6 text-[clamp(2.75rem,7vw,5.5rem)] leading-[0.95] font-extrabold tracking-[-0.02em] text-ink">
              Narawit
              <br />
              Aunsaen
            </h1>
            <p className="mt-8 max-w-[62ch] text-[17px] leading-relaxed text-ink">
              Most people call me Gundam. {introText}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#work"
                className="inline-flex h-12 items-center bg-ink px-6 text-[15px] font-semibold text-paper transition-colors duration-150 hover:bg-signal"
              >
                See my work
              </a>
              <a
                href="#contact"
                className="text-[15px] font-semibold text-ink underline decoration-rule decoration-2 underline-offset-[6px] transition-colors duration-150 hover:decoration-signal"
              >
                Get in touch
              </a>
            </div>
          </div>

          <dl className="self-end border-t border-ink text-[15px]">
            {focusAreas.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[7.5rem_1fr] gap-4 border-b border-rule py-3.5"
              >
                <dt className={label + " pt-0.5"}>{row.label}</dt>
                <dd className="text-ink">{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <ProjectsSection />

        {/* Contact */}
        <section id="contact" className="scroll-mt-20 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
            <div>
              <p className={label}>Contact</p>
              <h2 className="font-wide mt-4 text-[32px] leading-tight font-extrabold tracking-[-0.01em] text-ink">
                Have a project in mind?
              </h2>
              <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-muted">
                I’m happy to talk about new projects, collaborations, or an
                interesting problem. Message me on any of these.
              </p>
            </div>

            <ul className="self-end border-t border-ink">
              {socialLinks.map((link) => (
                <li key={link.label} className="border-b border-rule">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid grid-cols-[7.5rem_1fr_auto] items-center gap-4 py-4 text-ink"
                  >
                    <span className={label}>{link.label}</span>
                    <span className="truncate text-[17px] font-semibold transition-colors duration-150 group-hover:text-signal">
                      {link.handle}
                    </span>
                    <ArrowUpRightIcon className="h-4 w-4 text-muted transition-colors duration-150 group-hover:text-signal" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

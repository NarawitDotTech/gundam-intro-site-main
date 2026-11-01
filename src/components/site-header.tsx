const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex h-16 w-full max-w-[1120px] items-center justify-between px-5 sm:px-8">
        <a href="#top" id="top" className="font-wide text-[15px] font-extrabold tracking-[0.02em] text-ink uppercase">
          Gundam
        </a>
        <nav aria-label="Primary" className="flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[15px] text-muted transition-colors duration-150 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

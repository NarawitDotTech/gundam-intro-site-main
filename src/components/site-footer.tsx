import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-[1120px] items-center justify-between gap-4 px-5 py-8 font-mono text-xs tracking-[0.12em] text-muted uppercase sm:px-8">
        <p>© {new Date().getFullYear()} Narawit Aunsaen</p>
        <Link href="/admin" className="transition-colors duration-150 hover:text-ink">
          Admin
        </Link>
      </div>
    </footer>
  );
}

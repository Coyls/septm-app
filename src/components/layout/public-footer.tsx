import Link from "next/link";

const LINKS = [
  { href: "/statistics", label: "Statistiques" },
  { href: "/auth/signin", label: "Connexion" },
  { href: "/auth/signup", label: "Inscription" },
  { href: "/terms", label: "CGU" },
  { href: "/privacy", label: "Confidentialité" },
];

export function PublicFooter() {
  return (
    <footer className="border-t border-border px-[clamp(20px,5vw,56px)] py-7 flex items-center justify-between flex-wrap gap-3.5 max-sm:flex-col max-sm:items-center max-sm:text-center">
      <Link
        href="/"
        className="font-heading text-[14px] font-bold tracking-[0.16em] text-muted-foreground no-underline"
      >
        SEPT<em className="text-primary not-italic">M</em>
      </Link>

      <nav className="flex flex-wrap justify-center gap-5">
        {LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-[11.5px] text-muted-foreground tracking-[0.06em] transition-colors hover:text-accent"
          >
            {label}
          </Link>
        ))}
      </nav>

      <span className="text-[11px] text-muted-foreground/60 tracking-[0.04em]">
        © {new Date().getFullYear()} SEPTM · 7 Wonders Score Tracker
      </span>
    </footer>
  );
}

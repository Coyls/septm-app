import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="border-t border-border px-[clamp(20px,5vw,56px)] py-7 flex items-center justify-between flex-wrap gap-3.5">
      <Link
        href="/"
        className="font-heading text-sm font-bold tracking-[0.16em] text-muted-foreground no-underline"
      >
        SEPTM
      </Link>
      <nav className="flex gap-5">
        <Link
          href="/statistics"
          className="text-[11.5px] text-muted-foreground tracking-[0.06em] hover:text-primary transition-colors"
        >
          Statistiques
        </Link>
        <Link
          href="/auth/signin"
          className="text-[11.5px] text-muted-foreground tracking-[0.06em] hover:text-primary transition-colors"
        >
          Connexion
        </Link>
        <Link
          href="/auth/signup"
          className="text-[11.5px] text-muted-foreground tracking-[0.06em] hover:text-primary transition-colors"
        >
          Inscription
        </Link>
      </nav>
      <span className="text-[11px] text-muted-foreground/60 tracking-[0.04em]">
        © 2026 SEPTM · 7 Wonders Score Tracker
      </span>
    </footer>
  );
}

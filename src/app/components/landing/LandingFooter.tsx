import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="lp-footer">
      <Link href="/" className="lp-footer-logo">SEPTM</Link>
      <nav className="lp-footer-links">
        <Link href="/statistics" className="lp-footer-link">Statistiques</Link>
        <Link href="/auth/signin" className="lp-footer-link">Connexion</Link>
        <Link href="/auth/signup" className="lp-footer-link">Inscription</Link>
      </nav>
      <span className="lp-footer-copy">© 2026 SEPTM · 7 Wonders Score Tracker</span>
    </footer>
  );
}

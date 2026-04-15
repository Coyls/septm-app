import "./landing.css";

import { ArrowRight, BarChart2, Trophy, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="lp">
      {/* Grain */}
      <div className="lp-grain" aria-hidden />

      {/* ── NAV ── */}
      <nav className="lp-nav lp-f1">
        <Link href="/" className="lp-nav-logo">
          SEPT<em>M</em>
        </Link>
        <div className="lp-nav-right">
          <Link
            href="/statistics"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-xs tracking-widest uppercase hidden sm:inline-flex",
            )}
          >
            Stats
          </Link>
          <Link
            href="/auth/signin"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-xs",
            )}
          >
            Connexion
          </Link>
          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({ size: "sm" }),
              "text-xs tracking-wider uppercase",
            )}
          >
            Commencer
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero">
        <div className="lp-hero-grid" aria-hidden />
        <div className="lp-hero-glow" aria-hidden />
        <div className="lp-hero-watermark lp-f2" aria-hidden>VII</div>

        <div className="lp-hero-inner">
          <div className="lp-badge lp-r1">
            <span className="lp-badge-dot" />
            7 Wonders · Gratuit & open source
          </div>

          <h1 className="lp-hero-h1 lp-r2">
            Notez. Revivez.<br />
            <span className="lp-gold">Recommencez.</span>
          </h1>

          <p className="lp-hero-sub lp-r3">
            SEPTM est un outil gratuit pour noter vos scores de 7 Wonders,
            retrouver vos stats et vous souvenir de toutes vos soirées —
            même celle que vous auriez préféré oublier.
          </p>

          <div className="lp-hero-ctas lp-r4">
            <Link
              href="/auth/signup"
              className={cn(
                buttonVariants({ size: "lg" }),
                "text-xs tracking-widest uppercase px-8",
              )}
            >
              Créer un compte
            </Link>
            <Link
              href="/auth/signin"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-xs tracking-widest uppercase",
              )}
            >
              Se connecter
            </Link>
            <Link
              href="/statistics"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "text-xs tracking-widest uppercase",
              )}
            >
              Voir les stats <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="lp-scroll-hint lp-f3" aria-hidden>
          <div className="lp-scroll-needle" />
          <span>Défiler</span>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <div className="lp-stats">
        {[
          { n: "5",   sup: "", label: "Extensions supportées" },
          { n: "24",  sup: "", label: "Merveilles jouables"   },
          { n: "7",   sup: "", label: "Catégories de scores"  },
          { n: "0 €", sup: "", label: "Pour toujours"         },
        ].map(({ n, sup, label }) => (
          <div key={label} className="lp-stat">
            <div className="lp-stat-n">
              {n}{sup && <sup>{sup}</sup>}
            </div>
            <div className="lp-stat-l">{label}</div>
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section className="lp-section">
        <div className="lp-section-tag">
          <div className="lp-section-tag-bar" />
          <span className="lp-section-tag-text">Ce que ça fait</span>
        </div>
        <h2 className="lp-section-h2">
          Tout ce dont vous avez besoin,<br />rien de plus.
        </h2>
        <p className="lp-section-p">
          Simple à prendre en main, pensé pour les soirées entre amis.
          Pas de fioriture, pas de compte premium.
        </p>

        <div className="lp-feats">
          {[
            {
              num: "I",
              icon: Trophy,
              title: "Scores multi-extension",
              desc: "Vanilla, Leaders, Cities, Armada, Édifices — toutes les extensions sont là. Les points s'enregistrent catégorie par catégorie, fidèlement.",
              chips: ["Vanilla", "Leaders", "Cities", "Armada", "Édifices"],
            },
            {
              num: "II",
              icon: BarChart2,
              title: "Statistiques lisibles",
              desc: "Qui gagne le plus souvent à la maison ? Sur quelle merveille progressez-vous ? SEPTM répond sans avoir besoin d'ouvrir un tableur.",
              chips: ["Classements", "Tendances", "Par merveille"],
            },
            {
              num: "III",
              icon: Users,
              title: "Réseau de joueurs",
              desc: "Retrouvez vos partenaires habituels, gérez les invitations et accédez à l'historique de vos soirées partagées en quelques secondes.",
              chips: ["Invitations", "Tables", "Historique partagé"],
            },
          ].map(({ num, icon: Icon, title, desc, chips }) => (
            <div key={num} className="lp-feat">
              <div className="lp-feat-watermark" aria-hidden>{num}</div>
              <div className="lp-feat-icon">
                <Icon style={{ width: 17, height: 17, color: "var(--gold)" }} />
              </div>
              <div className="lp-feat-h3">{title}</div>
              <p className="lp-feat-p">{desc}</p>
              <div className="lp-chips">
                {chips.map((c) => (
                  <Badge key={c} className="lp-chip">{c}</Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <div className="lp-hiw-wrap">
        <div className="lp-section" style={{ paddingBottom: 0 }}>
          <div className="lp-section-tag">
            <div className="lp-section-tag-bar" />
            <span className="lp-section-tag-text">Comment ça marche</span>
          </div>
          <h2 className="lp-section-h2">Simple comme une partie.</h2>
        </div>

        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          <div className="lp-steps">
            {[
              {
                n: "01",
                pill: "Étape 1",
                title: "Créez une partie",
                desc: "Donnez un nom à la soirée, ajoutez les joueurs présents et choisissez les extensions sur la table.",
              },
              {
                n: "02",
                pill: "Étape 2",
                title: "Saisissez les scores",
                desc: "Entrez les points catégorie par catégorie. Le total se calcule tout seul — plus besoin de calculette.",
              },
              {
                n: "03",
                pill: "Étape 3",
                title: "Revivez la soirée",
                desc: "Retrouvez l'historique, comparez d'une soirée à l'autre et voyez qui progresse vraiment.",
              },
            ].map(({ n, pill, title, desc }) => (
              <div key={n} className="lp-step">
                <div className="lp-step-num" aria-hidden>{n}</div>
                <Badge className="lp-step-pill">{pill}</Badge>
                <div className="lp-step-h3">{title}</div>
                <p className="lp-step-p">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA BLOCK ── */}
      <section className="lp-cta">
        <div className="lp-cta-glow" aria-hidden />
        <h2 className="lp-cta-h2">
          Essayez sur votre<br />
          prochaine <span className="lp-gold">soirée.</span>
        </h2>
        <p className="lp-cta-p">
          C&apos;est gratuit, sans engagement, et ça se prend en main en deux minutes.
        </p>
        <div className="lp-cta-btns">
          <Link
            href="/auth/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "text-xs tracking-widest uppercase px-10",
            )}
          >
            Commencer gratuitement
          </Link>
          <Link
            href="/statistics"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "text-xs tracking-widest uppercase",
            )}
          >
            Voir les statistiques →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <Link href="/" className="lp-footer-logo">SEPTM</Link>
        <nav className="lp-footer-links">
          <Link href="/statistics" className="lp-footer-link">Statistiques</Link>
          <Link href="/auth/signin" className="lp-footer-link">Connexion</Link>
          <Link href="/auth/signup" className="lp-footer-link">Inscription</Link>
        </nav>
        <span className="lp-footer-copy">© 2026 SEPTM · 7 Wonders Score Tracker</span>
      </footer>
    </div>
  );
}

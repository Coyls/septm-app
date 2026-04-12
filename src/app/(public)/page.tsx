import Link from "next/link"
import { BarChart2, Trophy, Users } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pulse-gold {
          0%, 100% { opacity: 0.035; }
          50%       { opacity: 0.065; }
        }
        .fade-up   { animation: fadeUp 0.75s cubic-bezier(.22,.68,0,1.1) both; opacity: 0; }
        .fade-in   { animation: fadeIn 1s ease both; opacity: 0; }
        .d1 { animation-delay: 0.05s; }
        .d2 { animation-delay: 0.18s; }
        .d3 { animation-delay: 0.32s; }
        .d4 { animation-delay: 0.46s; }
        .d5 { animation-delay: 0.60s; }
        .d6 { animation-delay: 0.74s; }
        .d7 { animation-delay: 0.88s; }

        .feat-card {
          position: relative;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .feat-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(230,168,23,0.04) 0%, transparent 60%);
          pointer-events: none;
        }
        .feat-card:hover {
          border-color: rgba(230,168,23,0.3);
          transform: translateY(-2px);
        }
        .feat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(230,168,23,0.5), transparent);
        }

        .grain-overlay {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 100;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 220px;
        }

        .cta-primary {
          letter-spacing: 0.06em;
          font-size: 12px;
          font-weight: 600;
        }
        .cta-secondary {
          letter-spacing: 0.06em;
          font-size: 12px;
        }
      `}</style>

      <div className="grain-overlay" aria-hidden="true" />

      <div className="w-full max-w-3xl px-6 py-16">

        {/* ── HERO ── */}
        <section className="relative text-center mb-24">

          {/* Background VII */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
              overflow: 'hidden',
              animation: 'pulse-gold 5s ease-in-out infinite',
            }}
          >
            <span style={{
              fontSize: 'clamp(180px, 38vw, 340px)',
              fontWeight: 900,
              color: 'var(--primary)',
              opacity: 1,
              letterSpacing: '-0.04em',
              lineHeight: 1,
            }}>
              VII
            </span>
          </div>

          {/* Eyebrow */}
          <div className="fade-in d1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '32px' }}>
            <div style={{ height: '1px', width: '48px', background: 'linear-gradient(90deg, transparent, var(--primary))' }} />
            <span style={{
              fontSize: '9px',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: 'var(--primary)',
              fontWeight: 600,
            }}>
              7 Wonders · Score Tracker
            </span>
            <div style={{ height: '1px', width: '48px', background: 'linear-gradient(90deg, var(--primary), transparent)' }} />
          </div>

          {/* Title */}
          <h1
            className="fade-up d2"
            style={{
              fontSize: 'clamp(72px, 16vw, 136px)',
              fontWeight: 900,
              letterSpacing: '-0.045em',
              lineHeight: 0.88,
              marginBottom: '28px',
              background: 'linear-gradient(175deg, #ffffff 30%, rgba(255,255,255,0.45) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            SEPTM
          </h1>

          {/* Ornament */}
          <div className="fade-in d3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <div style={{ height: '1px', width: '32px', background: 'var(--border)' }} />
            <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--primary)', opacity: 0.7 }} />
            <div style={{ height: '1px', width: '32px', background: 'var(--border)' }} />
          </div>

          {/* Subtitle */}
          <p
            className="fade-up d3"
            style={{
              fontSize: '17px',
              lineHeight: 1.7,
              color: 'var(--muted-foreground)',
              maxWidth: '400px',
              margin: '0 auto 40px',
            }}
          >
            Enregistrez vos parties, analysez vos performances
            et mesurez-vous à vos adversaires.
          </p>

          {/* CTAs */}
          <div className="fade-up d4" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "cta-primary")}>
              COMMENCER
            </Link>
            <Link href="/signin" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "cta-secondary")}>
              SE CONNECTER
            </Link>
            <Link
              href="/statistics"
              className="cta-secondary"
              style={{
                padding: '10px 20px',
                fontSize: '12px',
                letterSpacing: '0.06em',
                color: 'var(--muted-foreground)',
                transition: 'color 0.2s',
                textDecoration: 'none',
              }}
              onMouseEnter={undefined}
            >
              STATISTIQUES GLOBALES →
            </Link>
          </div>
        </section>

        {/* ── DIVIDER ── */}
        <div className="fade-in d5" style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '56px' }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--border))' }} />
          <div style={{
            padding: '0 16px',
            display: 'flex',
            gap: '5px',
            alignItems: 'center',
          }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: i === 1 ? '5px' : '3px',
                height: i === 1 ? '5px' : '3px',
                borderRadius: '50%',
                background: i === 1 ? 'var(--primary)' : 'var(--border)',
                opacity: i === 1 ? 0.8 : 1,
              }} />
            ))}
          </div>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--border), transparent)' }} />
        </div>

        {/* ── FEATURES ── */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '64px' }}>
          {[
            {
              num: 'I',
              icon: Trophy,
              title: 'Scores multi-extension',
              desc: 'Vanilla, Leaders, Cities, Armada, Édifices — chaque catégorie de points, pour chaque extension.',
              delay: 'd5',
            },
            {
              num: 'II',
              icon: BarChart2,
              title: 'Statistiques avancées',
              desc: 'Classements, tendances mensuelles, performance par merveille, compétitivité et distribution des scores.',
              delay: 'd6',
            },
            {
              num: 'III',
              icon: Users,
              title: 'Réseau de joueurs',
              desc: 'Retrouvez vos partenaires de jeu, gérez vos invitations et composez vos tables rapidement.',
              delay: 'd7',
            },
          ].map(({ num, icon: Icon, title, desc, delay }) => (
            <div key={num} className={`feat-card fade-up ${delay}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(230,168,23,0.08)',
                  border: '1px solid rgba(230,168,23,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: 'rgba(230,168,23,0.3)',
                }}>
                  {num}
                </span>
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: 'var(--foreground)', letterSpacing: '-0.01em' }}>
                {title}
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.65, color: 'var(--muted-foreground)' }}>
                {desc}
              </p>
            </div>
          ))}
        </section>

        {/* ── FOOTER ── */}
        <div className="fade-in d7" style={{ textAlign: 'center', paddingBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--muted-foreground)', letterSpacing: '0.01em' }}>
            Déjà un compte ?{' '}
            <Link href="/signin" style={{ color: 'var(--primary)', fontWeight: 500 }} className="hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

      </div>
    </>
  )
}

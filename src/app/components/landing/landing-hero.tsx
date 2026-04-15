"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { useMePublic } from "@/lib/query/hooks/useAuth";
import { cn } from "@/lib/utils";

export function LandingHero() {
  const { data, isLoading } = useMePublic();
  return (
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
          {!isLoading && (
            data ? (
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "text-xs tracking-widest uppercase px-8",
                )}
              >
                Dashboard
              </Link>
            ) : (
              <>
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
              </>
            )
          )}
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
  );
}

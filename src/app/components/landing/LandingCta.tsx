import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingCta() {
  return (
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
  );
}

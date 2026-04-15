import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingNav() {
  return (
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
  );
}

"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { useMe } from "@/lib/query/hooks/useAuth";
import { cn } from "@/lib/utils";

export function PublicNav() {
  const { data, isLoading } = useMe();

  return (
    <nav className="sticky top-0 z-50 h-[60px] flex items-center justify-between px-[clamp(20px,5vw,56px)] border-b border-border bg-background/90 backdrop-blur-lg [-webkit-backdrop-filter:blur(16px)]">
      <Link
        href="/"
        className="font-heading text-[18px] font-bold tracking-[0.12em] text-foreground no-underline"
      >
        SEPT<em className="text-primary not-italic">M</em>
      </Link>
      <div className="flex items-center gap-1.5">
        <Link
          href="/statistics"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "text-xs tracking-widest uppercase hidden sm:inline-flex",
          )}
        >
          Stats
        </Link>
        {!isLoading && (
          data ? (
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "sm" }),
                "text-xs tracking-wider uppercase",
              )}
            >
              Dashboard
            </Link>
          ) : (
            <>
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
            </>
          )
        )}
      </div>
    </nav>
  );
}

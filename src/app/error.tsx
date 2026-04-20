"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center p-4">
      <h1 className="text-6xl font-bold text-primary">500</h1>
      <h2 className="text-xl font-semibold">Une erreur est survenue</h2>
      <p className="text-muted-foreground max-w-sm">
        Quelque chose s&apos;est mal passé. Vous pouvez réessayer ou revenir à
        l&apos;accueil.
      </p>
      {error.digest && (
        <p className="font-mono text-xs text-muted-foreground/60">
          {error.digest}
        </p>
      )}
      <div className="flex gap-3">
        <button
          onClick={unstable_retry}
          className={buttonVariants({ variant: "outline" })}
        >
          Réessayer
        </button>
        <Link href="/dashboard" className={buttonVariants()}>
          Tableau de bord
        </Link>
      </div>
    </div>
  );
}

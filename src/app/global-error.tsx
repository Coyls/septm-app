"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "16px",
          textAlign: "center",
          padding: "16px",
          fontFamily: "system-ui, sans-serif",
          background: "#fff",
          color: "#0a0a0a",
        }}
      >
        <h1 style={{ fontSize: "4rem", fontWeight: 700, margin: 0 }}>500</h1>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
          Erreur critique
        </h2>
        <p style={{ color: "#666", maxWidth: "360px", margin: 0 }}>
          Une erreur inattendue s&apos;est produite. Veuillez rafraîchir la
          page.
        </p>
        {error.digest && (
          <p
            style={{
              fontFamily: "monospace",
              fontSize: "0.7rem",
              color: "#999",
            }}
          >
            {error.digest}
          </p>
        )}
        <button
          onClick={unstable_retry}
          style={{
            padding: "8px 20px",
            border: "1px solid #e5e7eb",
            borderRadius: "6px",
            background: "#fff",
            cursor: "pointer",
            fontSize: "0.875rem",
          }}
        >
          Réessayer
        </button>
      </body>
    </html>
  );
}

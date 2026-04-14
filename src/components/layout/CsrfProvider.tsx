"use client"

import { useEffect } from "react"
import { getCsrfToken } from "@/lib/api/auth"
import { useCsrfStore } from "@/stores/csrf.store"

const MAX_ATTEMPTS = 3;

export function CsrfProvider({ children }: { children: React.ReactNode }) {
  const setToken = useCsrfStore((s) => s.setToken)

  useEffect(() => {
    let cancelled = false;

    async function fetchWithRetry() {
      for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
        try {
          const { csrfToken } = await getCsrfToken();
          if (!cancelled) setToken(csrfToken);
          return;
        } catch {
          if (attempt < MAX_ATTEMPTS) {
            await new Promise((r) => setTimeout(r, 500 * attempt));
          }
        }
      }
      console.error("[CsrfProvider] Failed to fetch CSRF token after", MAX_ATTEMPTS, "attempts. Mutations will be rejected by the server.");
    }

    fetchWithRetry();
    return () => { cancelled = true; };
  }, [setToken])

  return <>{children}</>
}

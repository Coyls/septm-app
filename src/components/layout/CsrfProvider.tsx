"use client"

import { useEffect } from "react"
import { getCsrfToken } from "@/lib/api/auth"
import { useCsrfStore } from "@/stores/csrf.store"

export function CsrfProvider({ children }: { children: React.ReactNode }) {
  const setToken = useCsrfStore((s) => s.setToken)

  useEffect(() => {
    getCsrfToken()
      .then(({ csrfToken }) => setToken(csrfToken))
      .catch(() => console.warn("CSRF token fetch failed"))
  }, [setToken])

  return <>{children}</>
}

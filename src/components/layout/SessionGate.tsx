"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1"

export function SessionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) {
          setChecked(true)
          return
        }

        if (pathname === "/auth/verify-email") {
          const meRes = await fetch(`${API_URL}/auth/me`, {
            credentials: "include",
          })
          if (meRes.ok) {
            const data = await meRes.json()
            if (data?.user?.emailVerified) {
              router.replace("/dashboard")
              return
            }
          }
          setChecked(true)
          return
        }

        const redirect = searchParams.get("redirect") ?? "/dashboard"
        router.replace(redirect)
      })
      .catch(() => setChecked(true))
  }, [router, searchParams, pathname])

  if (!checked) return null

  return <>{children}</>
}

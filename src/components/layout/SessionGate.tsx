"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1"

export function SessionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.ok) {
          const redirect = searchParams.get("redirect") ?? "/dashboard"
          router.replace(redirect)
        } else {
          setChecked(true)
        }
      })
      .catch(() => setChecked(true))
  }, [router, searchParams])

  if (!checked) return null

  return <>{children}</>
}

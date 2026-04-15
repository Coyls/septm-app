import { SessionGate } from "@/components/layout/SessionGate"
import { headers } from "next/headers"
import { Suspense } from "react"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hasRefreshToken = (await headers()).get("x-has-refresh-token") === "1"

  return (
    <Suspense fallback={null}>
      <SessionGate hasRefreshToken={hasRefreshToken}>
        <div className="min-h-screen flex items-center justify-center p-4">
          {children}
        </div>
      </SessionGate>
    </Suspense>
  )
}

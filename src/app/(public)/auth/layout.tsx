import { SessionGate } from "@/components/layout/SessionGate"
import { Suspense } from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <SessionGate>{children}</SessionGate>
    </Suspense>
  )
}

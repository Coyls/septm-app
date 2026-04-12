import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-center p-4">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-xl font-semibold">Page introuvable</h2>
      <p className="text-muted-foreground max-w-sm">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>
      <Link href="/dashboard" className={buttonVariants()}>
        Retour au tableau de bord
      </Link>
    </div>
  )
}

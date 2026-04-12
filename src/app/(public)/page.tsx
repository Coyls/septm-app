import Link from "next/link"
import { Trophy, BarChart2, Users, Star } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="w-full max-w-4xl space-y-16 py-8">
      {/* Hero */}
      <section className="text-center space-y-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Trophy className="h-12 w-12 text-primary" />
          <h1 className="text-5xl font-bold tracking-tight">SEPTM</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          Le suivi de scores pour <strong className="text-foreground">7 Wonders</strong>.
          Enregistrez vos parties, suivez vos statistiques et défiez vos amis.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "gap-2")}>
            <Star className="h-4 w-4" />
            Commencer
          </Link>
          <Link href="/signin" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Se connecter
          </Link>
          <Link href="/statistics" className={buttonVariants({ variant: "ghost", size: "lg" })}>
            Statistiques globales
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="h-5 w-5 text-primary" />
              Score multi-extension
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Saisie des scores par catégorie pour toutes les extensions : Vanilla,
            Leaders, Cities, Armada, Édifices, et plus encore.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart2 className="h-5 w-5 text-primary" />
              Statistiques avancées
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Classements, tendances mensuelles, performance par merveille et par
            face, distribution des scores.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-primary" />
              Gestion des amis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Invitez vos amis, gérez les demandes reçues, et retrouvez facilement
            vos partenaires de jeu lors de la création de parties.
          </CardContent>
        </Card>
      </section>

      {/* Footer link */}
      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/signin" className="text-primary hover:underline font-medium">
          Se connecter
        </Link>
      </p>
    </div>
  )
}

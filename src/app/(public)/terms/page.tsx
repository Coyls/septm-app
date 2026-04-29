import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNav } from "@/components/layout/public-nav";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — SEPTM",
  description: "Conditions générales d'utilisation de SEPTM.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <h1 className="text-2xl font-bold mb-2">Conditions d&apos;utilisation</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Dernière mise à jour : avril 2026
        </p>

        <section className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Présentation du service</h2>
            <p>
              SEPTM est un outil libre et gratuit de suivi de scores pour le jeu de société
              7 Wonders. Le service est accessible à l&apos;adresse{" "}
              <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">septm.xyz</span>.
              Le code source est disponible publiquement sous licence MIT.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Acceptation des conditions</h2>
            <p>
              En créant un compte ou en utilisant SEPTM, vous acceptez les présentes conditions.
              Si vous n&apos;êtes pas d&apos;accord, vous ne devez pas utiliser le service.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Création de compte</h2>
            <p>
              Pour accéder aux fonctionnalités du service, vous devez créer un compte avec une
              adresse email valide. Vous êtes responsable de la confidentialité de votre mot de
              passe et de toute activité effectuée depuis votre compte.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Utilisation acceptable</h2>
            <p>Vous vous engagez à ne pas :</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>Utiliser le service à des fins illégales ou frauduleuses</li>
              <li>Tenter de compromettre la sécurité ou les données d&apos;autres utilisateurs</li>
              <li>Automatiser des requêtes en dehors des usages normaux du service</li>
              <li>Usurper l&apos;identité d&apos;une autre personne</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Disponibilité du service</h2>
            <p>
              SEPTM est fourni &laquo; tel quel &raquo;, sans garantie de disponibilité continue.
              Le service peut être interrompu à tout moment pour maintenance ou pour toute autre raison,
              sans préavis. Étant un projet open source maintenu bénévolement, aucune garantie de
              niveau de service (SLA) n&apos;est offerte.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Données et suppression de compte</h2>
            <p>
              Vous pouvez supprimer votre compte à tout moment depuis les paramètres. La suppression
              entraîne l&apos;effacement de vos données personnelles conformément à notre{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                politique de confidentialité
              </Link>
              .
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Propriété intellectuelle</h2>
            <p>
              Le code source de SEPTM est distribué sous licence MIT. Le nom &laquo; 7 Wonders &raquo;
              est une marque déposée de Repos Production. SEPTM n&apos;est pas affilié à Repos Production.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Modifications</h2>
            <p>
              Ces conditions peuvent être mises à jour à tout moment. Les changements significatifs
              seront notifiés par email. L&apos;utilisation continue du service après modification vaut
              acceptation des nouvelles conditions.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">9. Contact</h2>
            <p>
              Pour toute question relative aux présentes conditions :{" "}
              <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="text-primary hover:underline">
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

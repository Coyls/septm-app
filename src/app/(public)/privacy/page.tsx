import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNav } from "@/components/layout/public-nav";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Politique de confidentialité — SEPTM",
  description: "Politique de confidentialité et traitement des données personnelles de SEPTM.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16">
        <h1 className="text-2xl font-bold mb-2">Politique de confidentialité</h1>
        <p className="text-sm text-muted-foreground mb-10">
          Dernière mise à jour : avril 2026
        </p>

        <section className="space-y-8 text-sm leading-relaxed text-foreground/80">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">1. Responsable du traitement</h2>
            <p>
              Le responsable du traitement des données personnelles collectées via SEPTM est :{" "}
              <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="text-primary hover:underline">
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">2. Données collectées</h2>
            <p>Lors de la création d&apos;un compte et de l&apos;utilisation du service, nous collectons :</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li><strong>Nom ou pseudo</strong> — pour l&apos;identification dans l&apos;application</li>
              <li><strong>Adresse email</strong> — pour l&apos;authentification et les communications liées au compte</li>
              <li><strong>Mot de passe</strong> — stocké sous forme hachée (argon2id), jamais en clair</li>
              <li><strong>Données de jeu</strong> — scores et parties enregistrées</li>
              <li><strong>Données techniques</strong> — logs de connexion pour la sécurité (adresse IP, date)</li>
            </ul>
            <p className="mt-3">
              Nous ne collectons pas de données de navigation, ne posons pas de cookies de tracking,
              et n&apos;intégrons aucun outil d&apos;analyse tiers (Google Analytics, etc.).
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">3. Finalités du traitement</h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Gestion de votre compte et authentification</li>
              <li>Fonctionnement du service (enregistrement et affichage des scores)</li>
              <li>Envoi d&apos;emails transactionnels (vérification d&apos;email, notifications de compte)</li>
              <li>Sécurité et détection des abus</li>
            </ul>
            <p className="mt-3">
              Base légale : exécution du contrat (art. 6.1.b RGPD) et intérêt légitime pour la
              sécurité (art. 6.1.f RGPD).
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">4. Sous-traitants</h2>
            <p>Vos données peuvent transiter par les services suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li>
                <strong>Resend</strong> — envoi d&apos;emails transactionnels (votre adresse email est
                transmise uniquement pour la délivrabilité des emails)
              </li>
            </ul>
            <p className="mt-3">Aucune donnée n&apos;est vendue ou partagée à des fins commerciales.</p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">5. Durée de conservation</h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Données de compte : jusqu&apos;à la suppression du compte</li>
              <li>Logs de sécurité : 90 jours glissants</li>
              <li>Tokens d&apos;authentification : expiration automatique (15 min pour les tokens d&apos;accès, 30 jours pour les tokens de rafraîchissement)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">6. Vos droits (RGPD)</h2>
            <p>Conformément au Règlement Général sur la Protection des Données, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside mt-2 space-y-1 pl-2">
              <li><strong>Accès</strong> — obtenir une copie de vos données</li>
              <li><strong>Rectification</strong> — corriger des données inexactes</li>
              <li><strong>Effacement</strong> — demander la suppression de vos données</li>
              <li><strong>Portabilité</strong> — recevoir vos données dans un format structuré</li>
              <li><strong>Opposition</strong> — vous opposer à un traitement</li>
            </ul>
            <p className="mt-3">
              La suppression du compte est disponible directement depuis les paramètres de l&apos;application.
              Pour exercer vos autres droits, contactez :{" "}
              <a href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`} className="text-primary hover:underline">
                {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
              </a>
              . Nous répondrons dans un délai de 30 jours.
            </p>
            <p className="mt-3">
              Vous avez également le droit d&apos;introduire une réclamation auprès de la CNIL
              (Commission Nationale de l&apos;Informatique et des Libertés).
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">7. Sécurité</h2>
            <p>
              Les mots de passe sont hachés avec argon2id. Les communications sont chiffrées via HTTPS.
              Des mécanismes de protection contre les attaques par force brute et CSRF sont en place.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">8. Modifications</h2>
            <p>
              Cette politique peut être mise à jour. En cas de modification substantielle,
              vous en serez informé par email. Consultez les{" "}
              <Link href="/terms" className="text-primary hover:underline">
                conditions d&apos;utilisation
              </Link>{" "}
              pour les autres aspects du service.
            </p>
          </div>
        </section>
      </main>
      <PublicFooter />
    </div>
  );
}

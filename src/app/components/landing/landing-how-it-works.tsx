import { Badge } from "@/components/ui/badge";

export function LandingHowItWorks() {
  return (
    <div className="lp-hiw-wrap">
      <div className="lp-section" style={{ paddingBottom: 0 }}>
        <div className="lp-section-tag">
          <div className="lp-section-tag-bar" />
          <span className="lp-section-tag-text">Comment ça marche</span>
        </div>
        <h2 className="lp-section-h2">Simple comme une partie.</h2>
      </div>

      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <div className="lp-steps">
          {[
            {
              n: "01",
              pill: "Étape 1",
              title: "Créez une partie",
              desc: "Donnez un nom à la soirée, ajoutez les joueurs présents et choisissez les extensions sur la table.",
            },
            {
              n: "02",
              pill: "Étape 2",
              title: "Saisissez les scores",
              desc: "Entrez les points catégorie par catégorie. Le total se calcule tout seul — plus besoin de calculette.",
            },
            {
              n: "03",
              pill: "Étape 3",
              title: "Revivez la soirée",
              desc: "Retrouvez l'historique, comparez d'une soirée à l'autre et voyez qui progresse vraiment.",
            },
          ].map(({ n, pill, title, desc }) => (
            <div key={n} className="lp-step">
              <div className="lp-step-num" aria-hidden>{n}</div>
              <Badge className="lp-step-pill">{pill}</Badge>
              <div className="lp-step-h3">{title}</div>
              <p className="lp-step-p">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

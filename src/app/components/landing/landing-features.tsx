import { BarChart2, Trophy, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function LandingFeatures() {
  return (
    <section className="lp-section">
      <div className="lp-section-tag">
        <div className="lp-section-tag-bar" />
        <span className="lp-section-tag-text">Ce que ça fait</span>
      </div>
      <h2 className="lp-section-h2">
        Tout ce dont vous avez besoin,
        <br />
        rien de plus.
      </h2>
      <p className="lp-section-p">
        Simple à prendre en main, pensé pour les soirées entre amis. Pas de
        fioriture, pas de compte premium.
      </p>

      <div className="lp-feats">
        {[
          {
            num: "I",
            icon: Trophy,
            title: "Scores multi-extension",
            desc: "Vanilla, Leaders, Cities, Armada, Édifices — toutes les extensions sont là. Les points s'enregistrent catégorie par catégorie, fidèlement.",
            chips: ["Vanilla", "Leaders", "Cities", "Armada", "Édifices"],
          },
          {
            num: "II",
            icon: BarChart2,
            title: "Statistiques lisibles",
            desc: "Qui gagne le plus souvent à la maison ? Sur quelle merveille progressez-vous ? SEPTM répond sans avoir besoin d'ouvrir un tableur.",
            chips: ["Classements", "Tendances", "Par merveille"],
          },
          {
            num: "III",
            icon: Users,
            title: "Réseau de joueurs",
            desc: "Retrouvez vos partenaires habituels, gérez les invitations et accédez à l'historique de vos soirées partagées en quelques secondes.",
            chips: ["Invitations", "Tables", "Historique partagé"],
          },
        ].map(({ num, icon: Icon, title, desc, chips }) => (
          <div key={num} className="lp-feat">
            <div className="lp-feat-watermark" aria-hidden>
              {num}
            </div>
            <div className="lp-feat-icon">
              <Icon
                style={{ width: 17, height: 17, color: "var(--primary)" }}
              />
            </div>
            <div className="lp-feat-h3">{title}</div>
            <p className="lp-feat-p">{desc}</p>
            <div className="lp-chips">
              {chips.map((c) => (
                <Badge key={c} className="lp-chip">
                  {c}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

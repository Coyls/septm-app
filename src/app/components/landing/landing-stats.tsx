export function LandingStats() {
  return (
    <div className="lp-stats">
      {[
        { n: "5",   label: "Extensions supportées" },
        { n: "24",  label: "Merveilles jouables"   },
        { n: "7",   label: "Catégories de scores"  },
        { n: "0 €", label: "Pour toujours"         },
      ].map(({ n, label }) => (
        <div key={label} className="lp-stat">
          <div className="lp-stat-n">{n}</div>
          <div className="lp-stat-l">{label}</div>
        </div>
      ))}
    </div>
  );
}

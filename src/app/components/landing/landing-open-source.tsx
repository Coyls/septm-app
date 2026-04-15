import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LandingOpenSource() {
  return (
    <div className="lp-oss-wrap">
      <div className="lp-oss-inner">

        {/* ── Left — Statement ── */}
        <div className="lp-oss-left">
          <div className="lp-oss-tag">
            <div className="lp-oss-tag-bar" />
            <span className="lp-oss-tag-text">Open source</span>
          </div>

          <h2 className="lp-oss-h2">
            Libre.<br />Pour toujours.
          </h2>

          <ul className="lp-oss-pledges">
            <li className="lp-oss-pledge">
              <span className="lp-oss-pledge-dot" />
              <span>
                <strong>Code public sur GitHub</strong> — inspectez,
                forkez, adaptez librement.
              </span>
            </li>
            <li className="lp-oss-pledge">
              <span className="lp-oss-pledge-dot" />
              <span>
                <strong>Licence MIT</strong> — aucune restriction
                d&apos;usage, commerciale ou non.
              </span>
            </li>
            <li className="lp-oss-pledge">
              <span className="lp-oss-pledge-dot" />
              <span>
                <strong>Contributions bienvenues</strong> — une idée,
                un bug, une extension manquante ? Les PR sont ouvertes.
              </span>
            </li>
            <li className="lp-oss-pledge">
              <span className="lp-oss-pledge-dot" />
              <span>
                <strong>Gratuit pour toujours</strong> — pas
                d&apos;abonnement caché, pas de monétisation future prévue.
              </span>
            </li>
          </ul>

          <Link
            href="#"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "lp-oss-btn text-xs tracking-wider uppercase",
            )}
          >
            Voir le dépôt →
          </Link>
        </div>

        {/* ── Right — License card ── */}
        <div className="lp-oss-right">
          <div className="lp-oss-card">
            <div className="lp-oss-card-bar">
              <span className="lp-oss-card-dot" style={{ background: "#9A4E42" }} />
              <span className="lp-oss-card-dot" style={{ background: "#6B7C50" }} />
              <span className="lp-oss-card-dot" style={{ background: "#B8673D" }} />
              <span className="lp-oss-card-filename">LICENSE</span>
            </div>
            <div className="lp-oss-card-body">
              <p className="lp-oss-line lp-oss-line--accent">MIT License</p>
              <p className="lp-oss-line lp-oss-line--muted">&nbsp;</p>
              <p className="lp-oss-line lp-oss-line--bright">Copyright © 2026 SEPTM</p>
              <p className="lp-oss-line lp-oss-line--muted">&nbsp;</p>
              <p className="lp-oss-line">Permission is hereby granted, free of charge,</p>
              <p className="lp-oss-line">to any person obtaining a copy of this software</p>
              <p className="lp-oss-line">and associated documentation files, to deal in</p>
              <p className="lp-oss-line">the Software <strong className="lp-oss-kw">without restriction</strong>,</p>
              <p className="lp-oss-line">including without limitation the rights to use,</p>
              <p className="lp-oss-line lp-oss-line--bright">copy, modify, merge, publish, distribute...</p>
              <p className="lp-oss-line lp-oss-line--muted">&nbsp;</p>
              <p className="lp-oss-line">The above copyright notice and this permission</p>
              <p className="lp-oss-line">notice shall be included in all copies or</p>
              <p className="lp-oss-line lp-oss-line--bright">substantial portions of the Software.</p>
              <p className="lp-oss-line lp-oss-line--muted">&nbsp;</p>
              <p className="lp-oss-line">THE SOFTWARE IS PROVIDED <strong className="lp-oss-kw">&quot;AS IS&quot;</strong>, WITHOUT</p>
              <p className="lp-oss-line">WARRANTY OF ANY KIND, EXPRESS OR IMPLIED.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

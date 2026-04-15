import "./landing.css";

import { PublicNav } from "@/components/layout/PublicNav";
import { LandingHero } from "@/app/components/landing/LandingHero";
import { LandingStats } from "@/app/components/landing/LandingStats";
import { LandingFeatures } from "@/app/components/landing/LandingFeatures";
import { LandingHowItWorks } from "@/app/components/landing/LandingHowItWorks";
import { LandingOpenSource } from "@/app/components/landing/LandingOpenSource";
import { LandingCta } from "@/app/components/landing/LandingCta";
import { LandingFooter } from "@/app/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="lp">
      <div className="lp-grain" aria-hidden />

      <PublicNav />
      <LandingHero />
      <LandingStats />
      <LandingFeatures />
      <LandingHowItWorks />
      <LandingOpenSource />
      <LandingCta />
      <LandingFooter />
    </div>
  );
}

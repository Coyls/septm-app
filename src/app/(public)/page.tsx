import "./landing.css";

import { LandingCta } from "@/app/components/landing/landing-cta";
import { LandingFeatures } from "@/app/components/landing/landing-features";
import { LandingFooter } from "@/app/components/landing/landing-footer";
import { LandingHero } from "@/app/components/landing/landing-hero";
import { LandingHowItWorks } from "@/app/components/landing/landing-how-it-works";
import { LandingOpenSource } from "@/app/components/landing/landing-open-source";
import { LandingStats } from "@/app/components/landing/landing-stats";
import { PublicNav } from "@/components/layout/public-nav";

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

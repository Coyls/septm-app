import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNav } from "@/components/layout/public-nav";
import { ScienceCalculator } from "@/components/science/science-calculator";

export default function ScienceCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 flex justify-center px-[clamp(20px,5vw,56px)] py-10">
        <ScienceCalculator />
      </main>
      <PublicFooter />
    </div>
  );
}

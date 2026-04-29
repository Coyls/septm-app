import { PublicFooter } from "@/components/layout/public-footer";
import { PublicNav } from "@/components/layout/public-nav";
import { GlobalStatisticsContent } from "@/components/statistics/global-statistics-content";

export default function StatisticsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicNav />
      <main className="flex-1 flex justify-center px-[clamp(20px,5vw,56px)] py-10">
        <GlobalStatisticsContent />
      </main>
      <PublicFooter />
    </div>
  );
}

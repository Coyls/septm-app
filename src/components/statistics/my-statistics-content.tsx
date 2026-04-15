"use client";

import { Competitiveness } from "@/components/statistics/charts/competitiveness";
import { ExtensionImpact } from "@/components/statistics/charts/extension-impact";
import { MonthlyTrend } from "@/components/statistics/charts/monthly-trend";
import { PointTypeDistribution } from "@/components/statistics/charts/point-type-distribution";
import { ScoreDistribution } from "@/components/statistics/charts/score-distribution";
import { SidePerformance } from "@/components/statistics/charts/side-performance";
import { WonderHighlights } from "@/components/statistics/charts/wonder-highlights";
import { WonderPerformance } from "@/components/statistics/charts/wonder-performance";
import { DateRangePicker } from "@/components/statistics/date-range-picker";
import { StatCard } from "@/components/statistics/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyStats } from "@/lib/query/hooks/useStatistics";
import { Swords, Target, Trophy } from "lucide-react";
import { useState } from "react";

export function MyStatisticsContent() {
  const [dateParams, setDateParams] = useState<{ from?: string; to?: string }>(
    {},
  );
  const { data, isLoading } = useMyStats(dateParams);

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Mes statistiques</h1>
        <DateRangePicker onChange={setDateParams} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Highlights merveilles — pleine largeur, 2 cartes internes côte à côte */}
        {data && (
          <div className="lg:col-span-4">
            <WonderHighlights data={data} />
          </div>
        )}

        {/* KPIs personnels */}
        {isLoading ? (
          <>
            <div className="lg:col-span-1">
              <Skeleton className="h-24 rounded-lg" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-24 rounded-lg" />
            </div>
            <div className="lg:col-span-2">
              <Skeleton className="h-24 rounded-lg" />
            </div>
          </>
        ) : (
          <>
            <div className="lg:col-span-1">
              <StatCard
                label="Parties terminées"
                value={data?.totalFinishedGames ?? 0}
                icon={Trophy}
                className="h-full"
              />
            </div>
            <div className="lg:col-span-1">
              <StatCard
                label="Taux de victoire"
                value={
                  data?.byPlayer[0] ? `${data.byPlayer[0].winRate} %` : "—"
                }
                icon={Target}
                className="h-full"
              />
            </div>
            <div className="lg:col-span-2">
              <StatCard
                label="Score moyen"
                value={
                  data?.byPlayer[0]
                    ? `${Math.round(data.byPlayer[0].averageScore)} pts`
                    : "—"
                }
                icon={Swords}
                className="h-full"
              />
            </div>
          </>
        )}

        {/* Tendance mensuelle */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <MonthlyTrend data={data?.trendByMonth} isLoading={isLoading} />
        </div>

        {/* Distribution des scores */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <ScoreDistribution
            data={data?.scoreDistribution}
            isLoading={isLoading}
          />
        </div>

        {/* Performance par merveille */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <WonderPerformance
            data={data?.wonderPerformance}
            isLoading={isLoading}
          />
        </div>

        {/* Performance par face */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <SidePerformance data={data?.sidePerformance} isLoading={isLoading} />
        </div>

        {/* Répartition types de points */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <PointTypeDistribution
            data={data?.pointTypeDistribution}
            isLoading={isLoading}
          />
        </div>

        {/* Impact des extensions */}
        <div className="lg:col-span-2 [&>div]:h-full">
          <ExtensionImpact data={data?.extensionImpact} isLoading={isLoading} />
        </div>

        {/* Compétitivité — pleine largeur */}
        <div className="lg:col-span-4">
          <Competitiveness data={data?.competitiveness} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

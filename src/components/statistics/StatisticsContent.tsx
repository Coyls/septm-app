"use client";

import { DateRangePicker } from "@/components/statistics/DateRangePicker";
import { StatCard } from "@/components/statistics/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGlobalStats, useMyStats } from "@/lib/query/hooks/useStatistics";
import { POINT_TYPE_META } from "@/lib/types";
import { formatScore, formatWinRate } from "@/lib/utils";
import { BarChart2, Star, TrendingUp, Trophy } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

// Lazy load Recharts to avoid SSR hydration issues
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false },
);
const LineChart = dynamic(() => import("recharts").then((m) => m.LineChart), {
  ssr: false,
});
const Line = dynamic(() => import("recharts").then((m) => m.Line), {
  ssr: false,
});
const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false },
);
const RechartsTooltip = dynamic(
  () => import("recharts").then((m) => m.Tooltip),
  { ssr: false },
);
const Legend = dynamic(() => import("recharts").then((m) => m.Legend), {
  ssr: false,
});

interface StatisticsContentProps {
  mode: "global" | "me";
}

export function StatisticsContent({ mode }: StatisticsContentProps) {
  const [dateParams, setDateParams] = useState<{ from?: string; to?: string }>(
    {},
  );
  const globalStats = useGlobalStats(dateParams);
  const meStats = useMyStats(dateParams);

  const query = mode === "global" ? globalStats : meStats;
  const { data, isLoading } = query;

  function SectionSkeleton() {
    return <Skeleton className="h-64 w-full rounded-lg" />;
  }

  // Best wonder highlights for "me" mode
  const mostPlayedWonder = data?.wonderPerformance.reduce(
    (a, b) => (b.games > a.games ? b : a),
    data.wonderPerformance[0],
  );
  const bestWinRateWonder = data?.wonderPerformance.reduce(
    (a, b) => (b.winRate > a.winRate ? b : a),
    data.wonderPerformance[0],
  );

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          {mode === "global" ? "Statistiques globales" : "Mes statistiques"}
        </h1>
        <DateRangePicker onChange={setDateParams} />
      </div>

      {/* Me mode highlights */}
      {mode === "me" && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mostPlayedWonder && (
            <Card>
              <CardContent className="flex items-center gap-4 pt-4">
                <Star className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Merveille la plus jouée
                  </p>
                  <p className="font-bold">{mostPlayedWonder.wonderId}</p>
                  <p className="text-xs text-muted-foreground">
                    {mostPlayedWonder.games} parties
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
          {bestWinRateWonder && (
            <Card>
              <CardContent className="flex items-center gap-4 pt-4">
                <Trophy className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Meilleur taux de victoire
                  </p>
                  <p className="font-bold">{bestWinRateWonder.wonderId}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatWinRate(bestWinRateWonder.winRate)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 1. KPI */}
      {isLoading ? (
        <Skeleton className="h-24 w-64 rounded-lg" />
      ) : (
        <StatCard
          label="Parties terminées"
          value={data?.totalFinishedGames ?? 0}
          icon={Trophy}
          className="max-w-xs"
        />
      )}

      {/* 2. Classement des joueurs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Classement des joueurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SectionSkeleton />
          ) : !data?.byPlayer.length ? (
            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Joueur</TableHead>
                  <TableHead className="text-right">Parties</TableHead>
                  <TableHead className="text-right">Score moyen</TableHead>
                  <TableHead className="text-right">Winrate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...data.byPlayer]
                  .sort((a, b) => b.winRate - a.winRate)
                  .map((p) => (
                    <TableRow key={p.playerKey}>
                      <TableCell className="font-medium">{p.label}</TableCell>
                      <TableCell className="text-right">{p.games}</TableCell>
                      <TableCell className="text-right">
                        {formatScore(Math.round(p.averageScore))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatWinRate(p.winRate)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 3. Tendance mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendance mensuelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SectionSkeleton />
          ) : !data?.trendByMonth.length ? (
            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.trendByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11 }}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="games"
                  name="Parties"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="averageScore"
                  name="Score moyen"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 4. Distribution des scores */}
      <Card>
        <CardHeader>
          <CardTitle>Distribution des scores</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SectionSkeleton />
          ) : !data?.scoreDistribution.length ? (
            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Parties"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 5. Performance par merveille */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par merveille</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SectionSkeleton />
          ) : !data?.wonderPerformance.length ? (
            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Merveille</TableHead>
                  <TableHead className="text-right">Parties</TableHead>
                  <TableHead className="text-right">Score moyen</TableHead>
                  <TableHead className="text-right">Winrate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...data.wonderPerformance]
                  .sort((a, b) => b.winRate - a.winRate)
                  .map((w) => (
                    <TableRow key={w.wonderId}>
                      <TableCell className="font-medium">
                        {w.wonderId}
                      </TableCell>
                      <TableCell className="text-right">{w.games}</TableCell>
                      <TableCell className="text-right">
                        {formatScore(Math.round(w.averageScore))}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatWinRate(w.winRate)}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 6. Performance par face */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par face (A / B)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SectionSkeleton />
          ) : !data?.sidePerformance.length ? (
            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.sidePerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="side" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="winRate"
                  name="Winrate (%)"
                  fill="var(--chart-1)"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="averageScore"
                  name="Score moyen"
                  fill="var(--chart-2)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 7. Répartition types de points */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition des types de points</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SectionSkeleton />
          ) : !data?.pointTypeDistribution.length ? (
            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                layout="vertical"
                data={data.pointTypeDistribution.map((d) => ({
                  ...d,
                  label: POINT_TYPE_META[d.pointTypeId]?.label ?? d.pointTypeId,
                }))}
                margin={{ left: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="label"
                  tick={{ fontSize: 11 }}
                  width={100}
                />
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Bar
                  dataKey="totalPoints"
                  name="Points totaux"
                  fill="var(--chart-3)"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 8. Impact des extensions */}
      <Card>
        <CardHeader>
          <CardTitle>Impact des extensions</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SectionSkeleton />
          ) : !data?.extensionImpact.length ? (
            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Extension</TableHead>
                  <TableHead className="text-right">Parties</TableHead>
                  <TableHead className="text-right">
                    Score moy. / joueur
                  </TableHead>
                  <TableHead className="text-right">Nb gagnants moy.</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.extensionImpact.map((e) => (
                  <TableRow key={e.extensionId}>
                    <TableCell className="font-medium">
                      {e.extensionId}
                    </TableCell>
                    <TableCell className="text-right">{e.games}</TableCell>
                    <TableCell className="text-right">
                      {formatScore(Math.round(e.averageScorePerPlayer))}
                    </TableCell>
                    <TableCell className="text-right">
                      {e.averageWinnerCount.toFixed(1)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* 9. Compétitivité */}
      <Card>
        <CardHeader>
          <CardTitle>Compétitivité</CardTitle>
          {data?.competitiveness?.averageGap !== undefined && (
            <p className="text-sm text-muted-foreground">
              Écart moyen entre 1er et 2ème :{" "}
              <strong className="text-foreground">
                {data.competitiveness.averageGap.toFixed(1)} pts
              </strong>
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SectionSkeleton />
          ) : !data?.competitiveness?.distribution.length ? (
            <p className="text-sm text-muted-foreground">Aucune donnée.</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.competitiveness.distribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Parties"
                  fill="var(--chart-4)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

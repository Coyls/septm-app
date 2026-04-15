"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatisticsResponse } from "@/lib/types";
import { POINT_TYPE_META } from "@/lib/types";
import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false },
);
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
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};

interface Props {
  data: StatisticsResponse["pointTypeDistribution"] | undefined;
  isLoading: boolean;
}

export function PointTypeDistribution({ data, isLoading }: Props) {
  const chartData = data?.map((d) => ({
    ...d,
    label: POINT_TYPE_META[d.pointTypeId]?.label ?? d.pointTypeId,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des types de points</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !chartData?.length ? (
          <p className="text-sm text-muted-foreground">Aucune donnée.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart layout="vertical" data={chartData} margin={{ left: 16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11 }}
                width={100}
              />
              <Tooltip contentStyle={tooltipStyle} />
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
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatisticsResponse } from "@/lib/types";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
};

interface Props {
  data: StatisticsResponse["sidePerformance"] | undefined;
  isLoading: boolean;
}

export function SidePerformance({ data, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance par face (A / B)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !data?.length ? (
          <p className="text-sm text-muted-foreground">Aucune donnée.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="side" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
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
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { StatisticsResponse } from "@/lib/types";

import {
  Bar,
  BarChart,
  CartesianGrid,
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
  data: StatisticsResponse["competitiveness"] | undefined;
  isLoading: boolean;
}

export function Competitiveness({ data, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Compétitivité</CardTitle>
        {data?.averageGap !== undefined && (
          <p className="text-sm text-muted-foreground">
            Écart moyen entre 1er et 2ème :{" "}
            <strong className="text-foreground">
              {data.averageGap.toFixed(1)} pts
            </strong>
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !data?.distribution.length ? (
          <p className="text-sm text-muted-foreground">Aucune donnée.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.distribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
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
  );
}

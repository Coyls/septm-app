"use client";

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
import type { StatisticsResponse } from "@/lib/types";
import { formatScore, formatWinRate } from "@/lib/utils";

interface Props {
  data: StatisticsResponse["wonderPerformance"] | undefined;
  isLoading: boolean;
}

export function WonderPerformance({ data, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance par merveille</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-64 w-full rounded-lg" />
        ) : !data?.length ? (
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
              {[...data]
                .sort((a, b) => b.winRate - a.winRate)
                .map((w) => (
                  <TableRow key={w.wonderId}>
                    <TableCell className="font-medium">{w.wonderId}</TableCell>
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
  );
}

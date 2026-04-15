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
import { BarChart2 } from "lucide-react";

interface Props {
  data: StatisticsResponse["byPlayer"] | undefined;
  isLoading: boolean;
}

export function PlayerRankings({ data, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          Classement des joueurs
        </CardTitle>
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
                <TableHead>Joueur</TableHead>
                <TableHead className="text-right">Parties</TableHead>
                <TableHead className="text-right">Score moyen</TableHead>
                <TableHead className="text-right">Winrate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...data]
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
  );
}

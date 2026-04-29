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
import { formatScore } from "@/lib/utils";

interface Props {
  data: StatisticsResponse["extensionImpact"] | undefined;
  isLoading: boolean;
}

export function ExtensionImpact({ data, isLoading }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Impact des extensions</CardTitle>
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
                <TableHead>Extension</TableHead>
                <TableHead className="text-right">Parties</TableHead>
                <TableHead className="text-right">
                  Score moy. / joueur
                </TableHead>
                <TableHead className="text-right">Nb gagnants moy.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((e) => (
                <TableRow key={e.extensionId}>
                  <TableCell className="font-medium">{e.extensionId}</TableCell>
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
  );
}

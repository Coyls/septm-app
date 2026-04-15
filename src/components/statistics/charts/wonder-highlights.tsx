"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { StatisticsResponse } from "@/lib/types";
import { formatWinRate } from "@/lib/utils";
import { Star, Trophy } from "lucide-react";

interface Props {
  data: StatisticsResponse;
}

export function WonderHighlights({ data }: Props) {
  const mostPlayed = data.wonderPerformance.reduce(
    (a, b) => (b.games > a.games ? b : a),
    data.wonderPerformance[0],
  );
  const bestWinRate = data.wonderPerformance.reduce(
    (a, b) => (b.winRate > a.winRate ? b : a),
    data.wonderPerformance[0],
  );

  if (!mostPlayed && !bestWinRate) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {mostPlayed && (
        <Card>
          <CardContent className="flex items-center gap-4 pt-4">
            <Star className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">
                Merveille la plus jouée
              </p>
              <p className="font-bold">{mostPlayed.wonderId}</p>
              <p className="text-xs text-muted-foreground">
                {mostPlayed.games} parties
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      {bestWinRate && (
        <Card>
          <CardContent className="flex items-center gap-4 pt-4">
            <Trophy className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">
                Meilleur taux de victoire
              </p>
              <p className="font-bold">{bestWinRate.wonderId}</p>
              <p className="text-xs text-muted-foreground">
                {formatWinRate(bestWinRate.winRate)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

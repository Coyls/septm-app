"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PointTypeId, PointTypeMeta } from "@/lib/types";
import { POINT_TYPE_META } from "@/lib/types";
import { formatCoinsToPoints } from "@/lib/utils";

export interface PlayerScoreState {
  playerId: string;
  playerName: string;
  wonderId: string;
  wonderName: string;
  wonderSide: string;
  coins: number;
  points: Record<PointTypeId, number>;
}

interface PlayerScoreCardProps {
  player: PlayerScoreState;
  allowedPointTypes: PointTypeMeta[];
  onChange: (
    playerId: string,
    field: "coins" | PointTypeId,
    value: number,
  ) => void;
}

export function PlayerScoreCard({
  player,
  allowedPointTypes,
  onChange,
}: PlayerScoreCardProps) {
  const coinsPoints = formatCoinsToPoints(player.coins);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="font-semibold">{player.playerName}</p>
            <p className="text-xs text-muted-foreground">
              {player.wonderName} — Face {player.wonderSide}
            </p>
          </div>
          <Badge variant="outline" className="text-sm font-bold">
            Total :{" "}
            {Object.values(player.points).reduce((a, b) => a + b, 0) +
              coinsPoints}{" "}
            pts
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Coins */}
        <div className="space-y-1">
          <Label
            htmlFor={`coins-${player.playerId}`}
            style={{ color: POINT_TYPE_META["COIN"].color }}
          >
            Pièces
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={`coins-${player.playerId}`}
              type="number"
              min={0}
              value={player.coins || ""}
              onChange={(e) =>
                onChange(
                  player.playerId,
                  "coins",
                  parseInt(e.target.value) || 0,
                )
              }
              className="w-24"
              placeholder="0"
            />
            <span className="text-xs text-muted-foreground">
              = {coinsPoints} pt{coinsPoints !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Point types */}
        {allowedPointTypes
          .filter((pt) => pt.id !== "COIN")
          .sort((a, b) => a.order - b.order)
          .map((pt) => (
            <div key={pt.id} className="space-y-1">
              <Label
                htmlFor={`${pt.id}-${player.playerId}`}
                style={{ color: pt.color }}
              >
                {pt.label}
              </Label>
              <Input
                id={`${pt.id}-${player.playerId}`}
                type="number"
                value={player.points[pt.id] || ""}
                onChange={(e) =>
                  onChange(
                    player.playerId,
                    pt.id,
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-24"
                placeholder="0"
              />
            </div>
          ))}
      </CardContent>
    </Card>
  );
}

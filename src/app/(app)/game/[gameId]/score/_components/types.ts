import type { PointTypeId } from "@/lib/types";

export interface PlayerScoreState {
  playerId: string;
  playerName: string;
  wonderName: string;
  wonderSide: string;
  coins: number;
  points: Record<PointTypeId, number>;
}

"use client";

import { useSubmitScore } from "@/lib/query/hooks/useGame";
import { useGameOptions } from "@/lib/query/hooks/useGameOptions";
import type { ExtensionId, PointTypeId } from "@/lib/types";
import { AppError, EXTENSION_POINT_TYPES, POINT_TYPE_META } from "@/lib/types";
import { calculatePlayerTotal, getErrorMessage } from "@/lib/utils";
import { useGameWizardStore } from "@/stores/game-wizard.store";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { LiveLeaderboard } from "./_components/live-leaderboard";
import { ScorePageHeader } from "./_components/score-page-header";
import { ScoreTable } from "./_components/score-table";
import type { PlayerScoreState } from "./_components/types";

export default function ScorePage({
  params,
}: {
  params: Promise<{ gameId: string }>;
}) {
  const { gameId } = use(params);
  const { players, selectedExtensions } = useGameWizardStore();
  const { data: options } = useGameOptions();
  const { mutate: submitScore, isPending } = useSubmitScore(gameId);

  const allowedPointTypeIds = new Set<PointTypeId>(
    (selectedExtensions as ExtensionId[]).flatMap(
      (ext) => EXTENSION_POINT_TYPES[ext] ?? [],
    ),
  );

  const rows = Object.values(POINT_TYPE_META)
    .filter((pt) => allowedPointTypeIds.has(pt.id))
    .sort((a, b) => a.order - b.order);

  const coinRow = rows.find((r) => r.id === "COIN");
  const pointRows = rows.filter((r) => r.id !== "COIN");

  function getWonderName(wonderId: string) {
    return options?.wonders.find((w) => w.id === wonderId)?.name ?? wonderId;
  }

  const [scores, setScores] = useState<PlayerScoreState[]>([]);

  useEffect(() => {
    useGameWizardStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (players.length > 0 && scores.length === 0) {
      setScores(
        players.map((p) => ({
          playerId: p.backendPlayerId ?? p.id,
          playerName: p.name,
          wonderName: getWonderName(p.wonderId ?? ""),
          wonderSide: p.wonderSide,
          coins: 0,
          points: Object.fromEntries(
            pointRows.map((pt) => [pt.id, 0]),
          ) as Record<PointTypeId, number>,
        })),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, options]);

  function handleChange(
    playerId: string,
    field: "coins" | PointTypeId,
    raw: string,
  ) {
    const value = raw === "" ? 0 : parseInt(raw, 10);
    if (isNaN(value)) return;
    setScores((prev) =>
      prev.map((p) => {
        if (p.playerId !== playerId) return p;
        if (field === "coins") return { ...p, coins: value };
        return { ...p, points: { ...p.points, [field]: value } };
      }),
    );
  }

  const sorted = [...scores].sort(
    (a, b) =>
      calculatePlayerTotal(b.coins, b.points) -
      calculatePlayerTotal(a.coins, a.points),
  );
  const gap =
    sorted.length >= 2
      ? calculatePlayerTotal(sorted[0].coins, sorted[0].points) -
        calculatePlayerTotal(sorted[1].coins, sorted[1].points)
      : 0;

  function handleSubmit() {
    submitScore(
      {
        players: scores.map((s) => ({
          playerId: s.playerId,
          coins: s.coins,
          points: pointRows.map((pt) => ({
            pointTypeId: pt.id,
            points: s.points[pt.id] ?? 0,
          })),
        })),
      },
      {
        onError: (err) => {
          const msg =
            err instanceof AppError
              ? getErrorMessage(err.code)
              : "Une erreur est survenue.";
          toast.error(msg);
        },
      },
    );
  }

  return (
    <div className="space-y-4">
      <ScorePageHeader
        gameId={gameId}
        isPending={isPending}
        disabled={scores.length === 0 || isPending || !scores.every((s) => s.coins >= 0)}
        onSubmit={handleSubmit}
      />
      <LiveLeaderboard sorted={sorted} gap={gap} />
      <ScoreTable
        scores={scores}
        sorted={sorted}
        coinRow={coinRow}
        pointRows={pointRows}
        onChange={handleChange}
      />
    </div>
  );
}

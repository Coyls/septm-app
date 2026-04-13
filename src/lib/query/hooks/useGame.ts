"use client";

import { createGame, submitScore } from "@/lib/api/game";
import type { CreateGameBody, UpsertGameScoreBody } from "@/lib/types";
import { useGameWizardStore } from "@/stores/game-wizard.store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCreateGame() {
  const router = useRouter();
  const setCreatedGameId = useGameWizardStore((s) => s.setCreatedGameId);
  const setBackendPlayerIds = useGameWizardStore((s) => s.setBackendPlayerIds);

  return useMutation({
    mutationFn: (body: CreateGameBody) => createGame(body),
    onSuccess: (data) => {
      setCreatedGameId(data.id);
      setBackendPlayerIds(data.players);
      router.push(`/game/${data.id}/score`);
    },
    onError: () => {
      toast.error("Erreur lors de la création de la partie");
    },
  });
}

export function useSubmitScore(gameId: string) {
  const router = useRouter();
  const resetWizard = useGameWizardStore((s) => s.reset);

  return useMutation({
    mutationFn: (body: UpsertGameScoreBody) => submitScore(gameId, body),
    onSuccess: () => {
      resetWizard();
      toast.success("Partie enregistrée !");
      router.push("/statistics/me");
    },
    onError: () => {
      toast.error("Erreur lors de l'enregistrement des scores");
    },
  });
}

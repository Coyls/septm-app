import type {
  CreateGameBody,
  CreateGameResponse,
  GameOptions,
  UpsertGameScoreBody,
} from "@/lib/types";
import { apiFetch } from "./fetch";

export function getGameOptions(): Promise<GameOptions> {
  return apiFetch("/game/options");
}

export function createGame(body: CreateGameBody): Promise<CreateGameResponse> {
  return apiFetch("/game", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function submitScore(
  gameId: string,
  body: UpsertGameScoreBody,
): Promise<{ id: string; status: "FINISHED" }> {
  return apiFetch(`/game/${gameId}/score`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

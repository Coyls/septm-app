"use client";

import { getGameOptions } from "@/lib/api/game";
import { queryKeys } from "@/lib/query/keys";
import { useQuery } from "@tanstack/react-query";

export function useGameOptions() {
  return useQuery({
    queryKey: queryKeys.game.options(),
    queryFn: getGameOptions,
    staleTime: Infinity,
  });
}

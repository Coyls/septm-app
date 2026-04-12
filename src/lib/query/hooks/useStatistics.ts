"use client";

import { getGlobalStats, getMyStats } from "@/lib/api/statistics";
import { queryKeys } from "@/lib/query/keys";
import { useQuery } from "@tanstack/react-query";

interface StatsParams {
  from?: string;
  to?: string;
}

export function useGlobalStats(params: StatsParams = {}) {
  return useQuery({
    queryKey: queryKeys.statistics.global(params),
    queryFn: () => getGlobalStats(params),
  });
}

export function useMyStats(params: StatsParams = {}) {
  return useQuery({
    queryKey: queryKeys.statistics.me(params),
    queryFn: () => getMyStats(params),
  });
}

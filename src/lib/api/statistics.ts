import type { StatisticsResponse } from "@/lib/types";
import { apiFetch } from "./fetch";

interface StatsParams {
  from?: string;
  to?: string;
}

function buildQuery(params: StatsParams): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return "";
  return (
    "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(v!)}`).join("&")
  );
}

export function getGlobalStats(
  params: StatsParams = {},
): Promise<StatisticsResponse> {
  return apiFetch(`/statistic/global${buildQuery(params)}`);
}

export function getMyStats(
  params: StatsParams = {},
): Promise<StatisticsResponse> {
  return apiFetch(`/statistic/me${buildQuery(params)}`);
}

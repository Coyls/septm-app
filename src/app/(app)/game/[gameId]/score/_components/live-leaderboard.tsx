import { calculatePlayerTotal, cn } from "@/lib/utils";
import type { PlayerScoreState } from "./types";

const MEDALS = ["🥇", "🥈", "🥉"];

export function LiveLeaderboard({
  sorted,
  gap,
}: {
  sorted: PlayerScoreState[];
  gap: number;
}) {
  if (sorted.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-lg border border-border bg-card px-3 py-2 text-sm">
      <span className="shrink-0 text-xs text-muted-foreground font-medium uppercase tracking-wide pr-2 border-r border-border">
        Classement
      </span>
      {sorted.map((p, idx) => {
        const total = calculatePlayerTotal(p.coins, p.points);
        return (
          <div
            key={p.playerId}
            className={cn(
              "flex items-center gap-1.5 shrink-0 rounded-md px-2 py-1",
              idx === 0
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground",
            )}
          >
            <span className="text-xs">{MEDALS[idx] ?? `${idx + 1}.`}</span>
            <span className="text-xs font-medium truncate max-w-[80px]">
              {p.playerName}
            </span>
            <span
              className={cn(
                "text-xs font-bold",
                idx === 0 ? "text-primary" : "",
              )}
            >
              {total}
            </span>
          </div>
        );
      })}
      {sorted.length >= 2 && (
        <span className="shrink-0 ml-auto text-xs text-muted-foreground pl-2 border-l border-border">
          Écart : <strong className="text-foreground">{gap} pts</strong>
        </span>
      )}
    </div>
  );
}

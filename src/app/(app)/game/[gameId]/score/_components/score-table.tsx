import type { PointTypeId, PointTypeMeta } from "@/lib/types";
import { calculatePlayerTotal, cn, formatCoinsToPoints } from "@/lib/utils";
import type { PlayerScoreState } from "./types";

export function ScoreTable({
  scores,
  sorted,
  coinRow,
  pointRows,
  onChange,
}: {
  scores: PlayerScoreState[];
  sorted: PlayerScoreState[];
  coinRow: PointTypeMeta | undefined;
  pointRows: PointTypeMeta[];
  onChange: (
    playerId: string,
    field: "coins" | PointTypeId,
    raw: string,
  ) => void;
}) {
  if (scores.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucun joueur trouvé. Revenez à la création de partie.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table
        className="w-full border-collapse"
        style={{ minWidth: `${180 + scores.length * 110}px` }}
      >
        {/* Player headers */}
        <thead>
          <tr className="border-b border-border bg-card">
            <th className="sticky left-0 z-20 bg-card w-[140px] min-w-[140px] px-3 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide border-r border-border">
              Catégorie
            </th>
            {scores.map((p, idx) => {
              const total = calculatePlayerTotal(p.coins, p.points);
              const isLeader = sorted[0]?.playerId === p.playerId;
              return (
                <th
                  key={p.playerId}
                  className={cn(
                    "px-2 py-3 text-center min-w-[110px]",
                    idx < scores.length - 1 && "border-r border-border",
                  )}
                >
                  <p
                    className={cn(
                      "text-sm font-semibold truncate",
                      isLeader ? "text-primary" : "text-foreground",
                    )}
                  >
                    {p.playerName || `J${idx + 1}`}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {p.wonderName} {p.wonderSide}
                  </p>
                  <p
                    className={cn(
                      "text-sm font-bold mt-0.5",
                      isLeader ? "text-primary" : "text-foreground",
                    )}
                  >
                    {total} pts
                  </p>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {/* Coins row */}
          {coinRow && (
            <tr className="border-b border-border hover:bg-muted/30 transition-colors">
              <td className="sticky left-0 z-10 bg-card px-3 py-3 border-r border-border">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: coinRow.color }}
                  />
                  <span className="text-xs font-medium text-foreground whitespace-nowrap">
                    {coinRow.label}
                  </span>
                </div>
              </td>
              {scores.map((p, idx) => {
                const pts = formatCoinsToPoints(p.coins);
                return (
                  <td
                    key={p.playerId}
                    className={cn(
                      "px-2 py-2 text-center",
                      idx < scores.length - 1 && "border-r border-border",
                    )}
                  >
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={p.coins === 0 ? "" : p.coins}
                      onChange={(e) =>
                        onChange(p.playerId, "coins", e.target.value)
                      }
                      placeholder="0"
                      className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                    <p className="text-[11px] text-muted-foreground mt-1">
                      = {pts} pt{pts !== 1 ? "s" : ""}
                    </p>
                  </td>
                );
              })}
            </tr>
          )}

          {/* Point type rows */}
          {pointRows.map((pt) => (
            <tr
              key={pt.id}
              className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
            >
              <td className="sticky left-0 z-10 bg-background px-3 py-3 border-r border-border">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: pt.color }}
                  />
                  <span className="text-xs font-medium text-foreground whitespace-nowrap">
                    {pt.label}
                  </span>
                </div>
              </td>
              {scores.map((p, idx) => (
                <td
                  key={p.playerId}
                  className={cn(
                    "px-2 py-2 text-center",
                    idx < scores.length - 1 && "border-r border-border",
                  )}
                >
                  <input
                    type="number"
                    inputMode="numeric"
                    value={p.points[pt.id] === 0 ? "" : p.points[pt.id]}
                    onChange={(e) =>
                      onChange(p.playerId, pt.id, e.target.value)
                    }
                    placeholder="0"
                    className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-center text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </td>
              ))}
            </tr>
          ))}

          {/* Total row */}
          <tr className="border-t-2 border-border bg-muted/20">
            <td className="sticky left-0 z-10 bg-background px-3 py-3 border-r border-border">
              <span className="text-xs font-bold uppercase tracking-wide text-foreground">
                Total
              </span>
            </td>
            {scores.map((p, idx) => {
              const total = calculatePlayerTotal(p.coins, p.points);
              const isLeader = sorted[0]?.playerId === p.playerId;
              return (
                <td
                  key={p.playerId}
                  className={cn(
                    "px-2 py-3 text-center",
                    idx < scores.length - 1 && "border-r border-border",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm font-bold",
                      isLeader ? "text-primary" : "text-foreground",
                    )}
                  >
                    {total} pts
                  </span>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

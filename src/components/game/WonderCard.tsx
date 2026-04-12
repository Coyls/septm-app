"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Wonder, Side, ExtensionId } from "@/lib/types"

interface WonderCardProps {
  wonder: Wonder
  selectedSide: Side
  onSideChange: (side: Side) => void
  isSelected: boolean
  onSelect: () => void
  isDisabled?: boolean
  availableExtensions: ExtensionId[]
}

export function WonderCard({
  wonder,
  selectedSide,
  onSideChange,
  isSelected,
  onSelect,
  isDisabled = false,
  availableExtensions,
}: WonderCardProps) {
  const sideB = wonder.sides.find((s) => s.side === "B")
  const sideBRequiredMissing =
    sideB?.requiredExtensions.filter((e) => !availableExtensions.includes(e)) ?? []
  const isSideBDisabled = sideBRequiredMissing.length > 0

  return (
    <div
      onClick={() => !isDisabled && onSelect()}
      className={cn(
        "rounded-lg border p-3 cursor-pointer transition-all select-none",
        isSelected
          ? "border-primary bg-primary/10 ring-1 ring-primary"
          : isDisabled
            ? "border-border opacity-40 cursor-not-allowed"
            : "border-border hover:border-primary/50 hover:bg-secondary",
      )}
      role="button"
      aria-pressed={isSelected}
      aria-disabled={isDisabled}
      tabIndex={isDisabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!isDisabled && (e.key === "Enter" || e.key === " ")) onSelect()
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium leading-tight">{wonder.name}</p>
        <Badge variant="secondary" className="text-xs shrink-0">
          {wonder.extensionId}
        </Badge>
      </div>

      {/* Side toggle — only shown when selected */}
      {isSelected && (
        <div
          className="flex gap-1 mt-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onSideChange("A")}
            className={cn(
              "flex-1 text-xs py-1 rounded border transition-colors",
              selectedSide === "A"
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50",
            )}
          >
            Face A
          </button>

          {isSideBDisabled ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    disabled
                    className="flex-1 text-xs py-1 rounded border border-border text-muted-foreground opacity-40 cursor-not-allowed"
                  />
                }
              >
                Face B
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  Requiert : {sideBRequiredMissing.join(", ")}
                </p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              onClick={() => onSideChange("B")}
              className={cn(
                "flex-1 text-xs py-1 rounded border transition-colors",
                selectedSide === "B"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50",
              )}
            >
              Face B
            </button>
          )}
        </div>
      )}
    </div>
  )
}

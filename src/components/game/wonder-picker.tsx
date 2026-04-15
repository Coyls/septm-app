"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ExtensionId, Side, Wonder, WonderId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const WONDER_IMAGE = "/extensions/placeholder.png";

interface WonderPickerProps {
  wonders: Wonder[];
  value: WonderId | null;
  selectedSide: Side;
  onWonderChange: (wonderId: WonderId) => void;
  onSideChange: (side: Side) => void;
  disabledWonderIds: Set<WonderId>;
  availableExtensions: ExtensionId[];
}

export function WonderPicker({
  wonders,
  value,
  selectedSide,
  onWonderChange,
  onSideChange,
  disabledWonderIds,
  availableExtensions,
}: WonderPickerProps) {
  const [open, setOpen] = useState(false);

  const selectedWonder = wonders.find((w) => w.id === value) ?? null;

  const sideB = selectedWonder?.sides.find((s) => s.side === "B");
  const sideBMissingExtensions =
    sideB?.requiredExtensions.filter((e) => !availableExtensions.includes(e)) ??
    [];
  const isSideBDisabled = sideBMissingExtensions.length > 0;

  return (
    <div className="space-y-2">
      {/* Wonder dropdown trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              className={cn(
                "w-full flex items-center gap-3 rounded-lg border px-3 h-14 text-left transition-all cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedWonder
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary/5",
              )}
            />
          }
        >
          {selectedWonder ? (
            <>
              <div className="relative shrink-0 h-9 w-9 rounded overflow-hidden">
                <Image
                  src={WONDER_IMAGE}
                  alt={selectedWonder.name}
                  fill
                  sizes="36px"
                  className="object-cover opacity-80"
                />
              </div>
              <span className="flex-1 text-sm font-medium truncate">
                {selectedWonder.name}
              </span>
            </>
          ) : (
            <span className="flex-1 text-sm">Choisir une merveille…</span>
          )}
          <ChevronDown className="shrink-0 h-4 w-4 opacity-50" />
        </PopoverTrigger>

        <PopoverContent
          className="p-2 w-(--radix-popover-trigger-width)"
          align="start"
          sideOffset={4}
        >
          <ScrollArea className="max-h-80">
            <div className="grid grid-cols-6 gap-1.5 pr-1">
              {wonders.map((wonder) => {
                const isTaken = disabledWonderIds.has(wonder.id as WonderId);
                const isSelected = wonder.id === value;

                return (
                  <button
                    key={wonder.id}
                    type="button"
                    disabled={isTaken}
                    onClick={() => {
                      onWonderChange(wonder.id as WonderId);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex flex-col rounded-lg border overflow-hidden text-left transition-all",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isSelected
                        ? "border-primary/60 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]"
                        : isTaken
                          ? "border-border opacity-35 cursor-not-allowed"
                          : "border-border hover:border-primary/40 cursor-pointer",
                    )}
                  >
                    {/* Image */}
                    <div className="relative w-full aspect-video bg-muted">
                      <Image
                        src={WONDER_IMAGE}
                        alt={wonder.name}
                        fill
                        sizes="(max-width: 640px) 15vw, 80px"
                        className={cn(
                          "object-cover",
                          isSelected ? "opacity-90" : "opacity-70",
                        )}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                          <Check className="h-4 w-4 text-primary drop-shadow" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div
                      className={cn(
                        "px-1.5 py-1.5",
                        isSelected ? "bg-primary/10" : "bg-card",
                      )}
                    >
                      <p className="text-xs font-medium leading-tight truncate">
                        {wonder.name}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {/* Side toggle — only shown after a wonder is selected */}
      {selectedWonder && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onSideChange("A")}
            className={cn(
              "py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              selectedSide === "A"
                ? "border-primary/60 bg-primary/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            Face A
          </button>

          {isSideBDisabled ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    disabled
                    className="py-2 rounded-lg border border-border bg-card text-sm font-medium text-muted-foreground opacity-40 cursor-not-allowed"
                  />
                }
              >
                Face B
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">
                  Requiert : {sideBMissingExtensions.join(", ")}
                </p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={() => onSideChange("B")}
              className={cn(
                "py-2 rounded-lg border text-sm font-medium transition-all cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selectedSide === "B"
                  ? "border-primary/60 bg-primary/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              Face B
            </button>
          )}
        </div>
      )}
    </div>
  );
}

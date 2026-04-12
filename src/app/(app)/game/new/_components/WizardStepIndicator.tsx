"use client"

import { cn } from "@/lib/utils"

const STEPS = [
  { label: "Extensions" },
  { label: "Joueurs" },
  { label: "Confirmation" },
]

export function WizardStepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((step, i) => {
        const stepNum = (i + 1) as 1 | 2 | 3
        const isActive = stepNum === currentStep
        const isDone = stepNum < currentStep

        return (
          <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                  isActive
                    ? "bg-primary border-primary text-primary-foreground"
                    : isDone
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-border text-muted-foreground",
                )}
              >
                {stepNum}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:block",
                  isActive ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "h-px flex-1 transition-colors",
                  isDone ? "bg-primary" : "bg-border",
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

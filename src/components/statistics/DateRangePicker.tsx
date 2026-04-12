"use client"

import { useState } from "react"
import { format, startOfWeek, startOfMonth, startOfYear } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  onChange: (range: { from?: string; to?: string }) => void
}

type Preset = "week" | "month" | "year" | "all" | "custom"

const PRESETS: { label: string; value: Preset }[] = [
  { label: "Cette semaine", value: "week" },
  { label: "Ce mois", value: "month" },
  { label: "Cette année", value: "year" },
  { label: "Tout", value: "all" },
  { label: "Personnalisé", value: "custom" },
]

function toISO(date: Date): string {
  return date.toISOString()
}

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [preset, setPreset] = useState<Preset>("all")
  const [customRange, setCustomRange] = useState<DateRange | undefined>()
  const [open, setOpen] = useState(false)

  function selectPreset(p: Preset) {
    setPreset(p)
    const now = new Date()

    if (p === "all") {
      onChange({})
    } else if (p === "week") {
      onChange({ from: toISO(startOfWeek(now, { locale: fr })), to: toISO(now) })
    } else if (p === "month") {
      onChange({ from: toISO(startOfMonth(now)), to: toISO(now) })
    } else if (p === "year") {
      onChange({ from: toISO(startOfYear(now)), to: toISO(now) })
    }
    // custom: wait for calendar selection
  }

  function handleCustomChange(range: DateRange | undefined) {
    setCustomRange(range)
    if (range?.from && range?.to) {
      onChange({ from: toISO(range.from), to: toISO(range.to) })
      setOpen(false)
    }
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {PRESETS.map((p) => (
        <Button
          key={p.value}
          variant={preset === p.value ? "default" : "outline"}
          size="sm"
          onClick={() => selectPreset(p.value)}
        >
          {p.label}
        </Button>
      ))}

      {preset === "custom" && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger render={<Button variant="outline" size="sm" className="gap-2" />}>
            <CalendarIcon className="h-4 w-4" />
            {customRange?.from && customRange?.to
              ? `${format(customRange.from, "d MMM", { locale: fr })} – ${format(customRange.to, "d MMM yyyy", { locale: fr })}`
              : "Sélectionner…"}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={handleCustomChange}
              locale={fr}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

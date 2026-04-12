"use client"

import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useFriends } from "@/lib/query/hooks/useFriends"

interface FriendComboboxProps {
  value: string | null
  onChange: (userId: string | null, name: string | null) => void
}

export function FriendCombobox({ value, onChange }: FriendComboboxProps) {
  const [open, setOpen] = useState(false)
  const { data: friends, isLoading } = useFriends()

  const selected = friends?.find((f) => f.friend.id === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            aria-expanded={open}
            className="w-full justify-between text-sm font-normal"
          />
        }
      >
        {selected
          ? selected.friend.name ?? selected.friend.email
          : "Associer à un ami (optionnel)"}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Rechercher un ami…" />
          <CommandList>
            <CommandEmpty>
              {isLoading ? "Chargement…" : "Aucun ami trouvé."}
            </CommandEmpty>
            <CommandGroup>
              {value && (
                <CommandItem
                  value="__clear__"
                  onSelect={() => {
                    onChange(null, null)
                    setOpen(false)
                  }}
                >
                  <Check className="mr-2 h-4 w-4 opacity-0" />
                  <span className="text-muted-foreground">Aucun</span>
                </CommandItem>
              )}
              {friends?.map((f) => (
                <CommandItem
                  key={f.friend.id}
                  value={f.friend.name ?? f.friend.email}
                  onSelect={() => {
                    onChange(
                      f.friend.id,
                      f.friend.name ?? f.friend.email,
                    )
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === f.friend.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {f.friend.name ?? f.friend.email}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

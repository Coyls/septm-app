"use client";

import { FriendCombobox } from "@/components/friends/FriendCombobox";
import { WonderPicker } from "@/components/game/WonderPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useMe } from "@/lib/query/hooks/useAuth";
import { useGameOptions } from "@/lib/query/hooks/useGameOptions";
import type { ExtensionId, Wonder, WonderId } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { WizardPlayerType } from "@/stores/game-wizard.store";
import { useGameWizardStore } from "@/stores/game-wizard.store";
import { PlusCircle, Trash2, UserRound, Users } from "lucide-react";
import { useEffect, useState } from "react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PLAYER_TYPES: {
  value: Exclude<WizardPlayerType, null>;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    value: "friend",
    label: "Ami",
    icon: Users,
    description: "Compte existant",
  },
  {
    value: "guest",
    label: "Invité",
    icon: UserRound,
    description: "Sans compte",
  },
];

export function PlayerStep() {
  const { data: options, isLoading } = useGameOptions();
  const { data: meData } = useMe();
  const {
    players,
    selectedExtensions,
    initSelfPlayer,
    addPlayer,
    removePlayer,
    updatePlayer,
    setStep,
  } = useGameWizardStore();

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (meData?.user?.userId) {
      initSelfPlayer(meData.user.userId);
    }
  }, [meData?.user?.userId, initSelfPlayer]);

  const availableWonders: Wonder[] =
    options?.wonders.filter((w) =>
      selectedExtensions.includes(w.extensionId as ExtensionId),
    ) ?? [];

  function handleTypeChange(
    playerId: string,
    type: Exclude<WizardPlayerType, null>,
  ) {
    // Reset identity fields when switching type
    updatePlayer(playerId, {
      playerType: type,
      userId: undefined,
      email: undefined,
      name: "",
    });
  }

  function validate() {
    const newErrors: Record<string, string> = {};

    if (players.length < 3) {
      newErrors["_global"] = "Il faut au minimum 3 joueurs.";
    }

    players.forEach((p, idx) => {
      const isSelf = idx === 0;
      // Self player is always treated as "friend" regardless of stored playerType
      const effectiveType = isSelf ? "friend" : p.playerType;

      if (!effectiveType) {
        newErrors[`${p.id}_type`] = "Choisissez un type de joueur.";
        return;
      }

      if (!p.name.trim()) {
        newErrors[`${p.id}_name`] = "Le nom est requis.";
      }

      if (effectiveType === "friend" && !p.userId) {
        newErrors[`${p.id}_friend`] = "Sélectionnez un ami.";
      }

      if (effectiveType === "guest") {
        if (!p.email?.trim()) {
          newErrors[`${p.id}_email`] = "L'email est requis.";
        } else if (!EMAIL_RE.test(p.email.trim())) {
          newErrors[`${p.id}_email`] = "Adresse email invalide.";
        }
      }

      if (!p.wonderId) {
        newErrors[`${p.id}_wonder`] = "Choisissez une merveille.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validate()) setStep(3);
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Configurez les joueurs</h2>
        <p className="text-sm text-muted-foreground">
          Minimum 3 joueurs. Chaque joueur doit choisir une merveille unique.
        </p>
      </div>

      {errors["_global"] && (
        <p className="text-sm text-destructive">{errors["_global"]}</p>
      )}

      <div className="space-y-4">
        {players.map((player, idx) => {
          const isSelf = idx === 0;

          return (
            <Card key={player.id}>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">Joueur {idx + 1}</CardTitle>
                  {isSelf && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-medium">
                      Vous
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => removePlayer(player.id)}
                  disabled={isSelf}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Type toggle — hidden for self (always "friend") */}
                {!isSelf && (
                  <div className="space-y-1.5">
                    <Label>Type de joueur</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PLAYER_TYPES.map(
                        ({ value, label, icon: Icon, description }) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => handleTypeChange(player.id, value)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all cursor-pointer",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              player.playerType === value
                                ? "border-primary/60 bg-primary/10 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.25)]"
                                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-primary/5 hover:text-foreground",
                            )}
                          >
                            <Icon
                              className={cn(
                                "h-4 w-4 shrink-0",
                                player.playerType === value
                                  ? "text-primary"
                                  : "text-muted-foreground",
                              )}
                            />
                            <div className="flex flex-col">
                              <span className="text-sm font-medium leading-tight">
                                {label}
                              </span>
                              <span className="text-xs text-(--text-weak) leading-tight">
                                {description}
                              </span>
                            </div>
                          </button>
                        ),
                      )}
                    </div>
                    {errors[`${player.id}_type`] && (
                      <p className="text-xs text-destructive">
                        {errors[`${player.id}_type`]}
                      </p>
                    )}
                  </div>
                )}

                {/* Identity fields */}
                {isSelf && (
                  <div className="space-y-1">
                    <Label htmlFor={`name-${player.id}`}>Nom affiché *</Label>
                    <Input
                      id={`name-${player.id}`}
                      value={player.name}
                      onChange={(e) =>
                        updatePlayer(player.id, { name: e.target.value })
                      }
                      placeholder="Prénom ou pseudo"
                    />
                    {errors[`${player.id}_name`] && (
                      <p className="text-xs text-destructive">
                        {errors[`${player.id}_name`]}
                      </p>
                    )}
                  </div>
                )}

                {!isSelf && player.playerType === "friend" && (
                  <>
                    <div className="space-y-1">
                      <Label>Ami *</Label>
                      <FriendCombobox
                        value={player.userId ?? null}
                        onChange={(userId, name) => {
                          updatePlayer(player.id, {
                            userId: userId ?? undefined,
                            name: name ?? player.name,
                          });
                        }}
                      />
                      {errors[`${player.id}_friend`] && (
                        <p className="text-xs text-destructive">
                          {errors[`${player.id}_friend`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`name-${player.id}`}>Nom affiché *</Label>
                      <Input
                        id={`name-${player.id}`}
                        value={player.name}
                        onChange={(e) =>
                          updatePlayer(player.id, { name: e.target.value })
                        }
                        placeholder="Prénom ou pseudo"
                      />
                      {errors[`${player.id}_name`] && (
                        <p className="text-xs text-destructive">
                          {errors[`${player.id}_name`]}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {!isSelf && player.playerType === "guest" && (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor={`name-${player.id}`}>Nom *</Label>
                      <Input
                        id={`name-${player.id}`}
                        value={player.name}
                        onChange={(e) =>
                          updatePlayer(player.id, { name: e.target.value })
                        }
                        placeholder="Prénom ou pseudo"
                      />
                      {errors[`${player.id}_name`] && (
                        <p className="text-xs text-destructive">
                          {errors[`${player.id}_name`]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor={`email-${player.id}`}>Email *</Label>
                      <Input
                        id={`email-${player.id}`}
                        type="email"
                        value={player.email ?? ""}
                        onChange={(e) =>
                          updatePlayer(player.id, { email: e.target.value })
                        }
                        placeholder="joueur@exemple.com"
                      />
                      {errors[`${player.id}_email`] && (
                        <p className="text-xs text-destructive">
                          {errors[`${player.id}_email`]}
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* Wonder selection — always visible for self, otherwise after type is chosen */}
                {(isSelf || player.playerType) && (
                  <div className="space-y-1">
                    <Label>Merveille *</Label>
                    {errors[`${player.id}_wonder`] && (
                      <p className="text-xs text-destructive">
                        {errors[`${player.id}_wonder`]}
                      </p>
                    )}
                    <WonderPicker
                      wonders={availableWonders}
                      value={player.wonderId}
                      selectedSide={player.wonderSide}
                      onWonderChange={(wonderId) =>
                        updatePlayer(player.id, { wonderId })
                      }
                      onSideChange={(side) =>
                        updatePlayer(player.id, { wonderSide: side })
                      }
                      disabledWonderIds={
                        new Set(
                          players
                            .filter((p) => p.id !== player.id && p.wonderId)
                            .map((p) => p.wonderId as WonderId),
                        )
                      }
                      availableExtensions={selectedExtensions as ExtensionId[]}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={addPlayer}>
        <PlusCircle className="h-4 w-4" />
        Ajouter un joueur
      </Button>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => setStep(1)}>
          ← Précédent
        </Button>
        <Button onClick={handleNext}>Suivant →</Button>
      </div>
    </div>
  );
}

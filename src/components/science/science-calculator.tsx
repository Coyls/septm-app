"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getBestScienceScore } from "@/lib/science-calculator";
import { cn } from "@/lib/utils";
import { Calculator, Cog, Compass, Minus, Plus, Scroll, Sparkles } from "lucide-react";
import { useState } from "react";

type CounterProps = {
  label: string;
  icon: React.ElementType;
  value: number;
  onChange: (v: number) => void;
  iconClassName?: string;
};

function Counter({ label, icon: Icon, value, onChange, iconClassName }: CounterProps) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 pt-5 pb-4">
        <Icon className={cn("h-7 w-7", iconClassName ?? "text-primary")} />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onChange(Math.max(0, value - 1))}
            disabled={value === 0}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-xl font-bold tabular-nums">{value}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onChange(value + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ScienceCalculator() {
  const [wheel, setWheel] = useState(0);
  const [compass, setCompass] = useState(0);
  const [tablet, setTablet] = useState(0);
  const [jokers, setJokers] = useState(0);

  const result = getBestScienceScore({ wheel, compass, tablet }, jokers);
  const { details, jokers: jokerDist, counts } = result;
  const hasJokers = jokers > 0;

  return (
    <div className="w-full max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calculator className="h-6 w-6 text-primary" />
          Calculateur scientifique
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Seven Wonders — optimise la répartition des jokers
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Counter label="Roues" icon={Cog} value={wheel} onChange={setWheel} />
        <Counter
          label="Compas"
          icon={Compass}
          value={compass}
          onChange={setCompass}
        />
        <Counter
          label="Tablettes"
          icon={Scroll}
          value={tablet}
          onChange={setTablet}
        />
        <Counter
          label="Jokers"
          icon={Sparkles}
          value={jokers}
          onChange={setJokers}
          iconClassName="text-amber-500"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Score optimal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-4xl font-bold tabular-nums text-primary">
            {result.score}{" "}
            <span className="text-lg font-medium text-muted-foreground">pts</span>
          </p>

          {hasJokers && (
            <>
              <Separator />
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Répartition optimale des jokers
                </p>
                <div className="flex gap-5 text-sm">
                  <span className="flex items-center gap-1.5">
                    <Cog className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-amber-500 font-medium">
                      +{jokerDist.wheel}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Compass className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-amber-500 font-medium">
                      +{jokerDist.compass}
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Scroll className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-amber-500 font-medium">
                      +{jokerDist.tablet}
                    </span>
                  </span>
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Cog className="h-3.5 w-3.5 shrink-0" />
                Roues
                <span className="font-mono text-xs">
                  ({counts.wheel}² = {details.wheelPoints})
                </span>
              </span>
              <span className="font-medium tabular-nums">{details.wheelPoints} pts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Compass className="h-3.5 w-3.5 shrink-0" />
                Compas
                <span className="font-mono text-xs">
                  ({counts.compass}² = {details.compassPoints})
                </span>
              </span>
              <span className="font-medium tabular-nums">
                {details.compassPoints} pts
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Scroll className="h-3.5 w-3.5 shrink-0" />
                Tablettes
                <span className="font-mono text-xs">
                  ({counts.tablet}² = {details.tabletPoints})
                </span>
              </span>
              <span className="font-medium tabular-nums">
                {details.tabletPoints} pts
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Séries complètes
                <span className="font-mono text-xs ml-1">
                  (min {counts.wheel},{counts.compass},{counts.tablet} ={" "}
                  {details.setCount} × 7)
                </span>
              </span>
              <span className="font-medium tabular-nums">{details.setPoints} pts</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

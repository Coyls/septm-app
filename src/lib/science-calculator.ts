export type ScienceSymbol = "wheel" | "compass" | "tablet";

export type ScienceCounts = Record<ScienceSymbol, number>;

export type ScienceResult = {
  score: number;
  counts: ScienceCounts;
  jokers: ScienceCounts;
  details: {
    wheelPoints: number;
    compassPoints: number;
    tabletPoints: number;
    setCount: number;
    setPoints: number;
  };
};

function calculateScienceScore(
  counts: ScienceCounts,
): ScienceResult["details"] & { score: number } {
  const wheelPoints = counts.wheel ** 2;
  const compassPoints = counts.compass ** 2;
  const tabletPoints = counts.tablet ** 2;

  const setCount = Math.min(counts.wheel, counts.compass, counts.tablet);
  const setPoints = setCount * 7;

  return {
    wheelPoints,
    compassPoints,
    tabletPoints,
    setCount,
    setPoints,
    score: wheelPoints + compassPoints + tabletPoints + setPoints,
  };
}

export function getBestScienceScore(
  baseCounts: ScienceCounts,
  jokerCount: number,
): ScienceResult {
  let bestResult: ScienceResult | null = null;

  for (let jokerWheel = 0; jokerWheel <= jokerCount; jokerWheel++) {
    for (
      let jokerCompass = 0;
      jokerCompass <= jokerCount - jokerWheel;
      jokerCompass++
    ) {
      const jokerTablet = jokerCount - jokerWheel - jokerCompass;

      const counts: ScienceCounts = {
        wheel: baseCounts.wheel + jokerWheel,
        compass: baseCounts.compass + jokerCompass,
        tablet: baseCounts.tablet + jokerTablet,
      };

      const details = calculateScienceScore(counts);

      const result: ScienceResult = {
        score: details.score,
        counts,
        jokers: {
          wheel: jokerWheel,
          compass: jokerCompass,
          tablet: jokerTablet,
        },
        details,
      };

      if (bestResult === null || result.score > bestResult.score) {
        bestResult = result;
      }
    }
  }

  if (bestResult === null) {
    throw new Error("No science result found");
  }

  return bestResult;
}

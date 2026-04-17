import { describe, expect, it } from "vitest";

import { clans, profiles } from "@/data/demo";
import { calculateCompatibility } from "@/lib/compatibility";

describe("calculateCompatibility", () => {
  it("devuelve una puntuación alta cuando el encaje es bueno", () => {
    const result = calculateCompatibility(profiles[1]!, clans[0]!);

    expect(result.score).toBeGreaterThanOrEqual(75);
    expect(result.breakdown.gamePlatform).toBe(25);
  });

  it("penaliza cuando no hay juego principal compartido", () => {
    const result = calculateCompatibility(profiles[4]!, clans[1]!);

    expect(result.breakdown.gamePlatform).toBeLessThan(25);
    expect(result.score).toBeLessThan(70);
  });
});

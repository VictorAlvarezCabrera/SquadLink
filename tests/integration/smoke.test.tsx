import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CompatibilityCard } from "@/components/shared/compatibility-card";
import { clans, profiles } from "@/data/demo";
import { calculateCompatibility } from "@/lib/compatibility";

describe("smoke rendering", () => {
  it("muestra la puntuación de compatibilidad", () => {
    const result = calculateCompatibility(profiles[2]!, clans[0]!);

    render(<CompatibilityCard clan={clans[0]!} result={result} />);

    expect(screen.getAllByText(/compatibilidad/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/nightwatch protocol/i)).toBeInTheDocument();
  });
});

import { describe, expect, it } from "vitest";

import { loginSchema } from "@/validations/auth";
import { clanSchema } from "@/validations/clan";

describe("zod validations", () => {
  it("acepta credenciales válidas", () => {
    const result = loginSchema.safeParse({
      email: "test@squadlink.gg",
      password: "demo12345",
    });

    expect(result.success).toBe(true);
  });

  it("rechaza un clan con descripción demasiado corta", () => {
    const result = clanSchema.safeParse({
      name: "AB",
      tagline: "Clan corto",
      description: "corta",
      visibility: "public",
    });

    expect(result.success).toBe(false);
  });
});

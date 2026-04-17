import { z } from "zod";

export const clanSchema = z.object({
  name: z.string().min(3).max(50),
  tagline: z.string().min(10).max(120),
  description: z.string().min(40).max(600),
  visibility: z.enum(["public", "private"]),
});

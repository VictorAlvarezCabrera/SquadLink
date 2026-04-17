import { z } from "zod";

export const profileSchema = z.object({
  nick: z.string().min(3).max(20),
  bio: z.string().min(10).max(280),
  languages: z.array(z.string()).min(1),
  reliabilityScore: z.number().min(0).max(100),
});

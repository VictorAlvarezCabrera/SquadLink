import { z } from "zod";

export const lfgSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(20).max(300),
  languages: z.array(z.string()).min(1),
});

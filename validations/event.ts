import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().min(20).max(300),
  capacity: z.number().int().min(2).max(100),
});

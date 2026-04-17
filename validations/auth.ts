import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Introduce un email válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export const registerSchema = z.object({
  nick: z.string().min(3).max(20),
  email: z.string().email(),
  password: z.string().min(8),
});

export const recoverAccessSchema = z.object({
  email: z.string().email(),
});

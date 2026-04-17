import { NextResponse } from "next/server";
import { z, type ZodSchema } from "zod";

import { AppError } from "@/lib/app-error";

export async function parseJson<T>(request: Request, schema: ZodSchema<T>) {
  const body = await request.json().catch(() => {
    throw new AppError("JSON inválido.", 400);
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues[0]?.message ?? "Datos inválidos.", 400);
  }

  return parsed.data;
}

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function apiError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues[0]?.message ?? "Datos inválidos." }, { status: 400 });
  }

  return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
}

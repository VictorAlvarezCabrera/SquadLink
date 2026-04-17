"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { findDemoProfileForCredentials } from "@/lib/auth/session";
import { demoAuthCookie } from "@/lib/constants";
import { isDemoMode } from "@/lib/env";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, recoverAccessSchema, registerSchema } from "@/validations/auth";

export interface FormState {
  success?: boolean;
  message?: string;
}

export async function loginAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  if (isDemoMode) {
    const profile = findDemoProfileForCredentials(parsed.data.email, parsed.data.password);
    if (!profile) {
      return { success: false, message: "Credenciales demo incorrectas." };
    }

    const cookieStore = await cookies();
    cookieStore.set(demoAuthCookie, profile.id, { httpOnly: true, sameSite: "lax", path: "/" });
    redirect("/dashboard");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase no está configurado." };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    return { success: false, message: error.message };
  }

  redirect("/dashboard");
}

export async function registerAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse({
    nick: formData.get("nick"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  if (isDemoMode) {
    const cookieStore = await cookies();
    cookieStore.set(demoAuthCookie, "profile_newcomer", { httpOnly: true, sameSite: "lax", path: "/" });
    redirect("/dashboard");
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase no está configurado." };
  }

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        nick: parsed.data.nick,
      },
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Cuenta creada. Revisa tu correo para confirmar el acceso." };
}

export async function recoverAccessAction(_previousState: FormState, formData: FormData): Promise<FormState> {
  const parsed = recoverAccessSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message };
  }

  if (isDemoMode) {
    return { success: true, message: "Modo demo: se simula el envío del correo de recuperación." };
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { success: false, message: "Supabase no está configurado." };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email);
  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Revisa tu correo para continuar." };
}

export async function logoutAction() {
  if (isDemoMode) {
    const cookieStore = await cookies();
    cookieStore.delete(demoAuthCookie);
    redirect("/");
  }

  const supabase = await createServerSupabaseClient();
  await supabase?.auth.signOut();
  redirect("/");
}

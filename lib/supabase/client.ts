"use client";

import { createBrowserClient } from "@supabase/ssr";

import { env, isSupabaseEnabled } from "@/lib/env";

export function createClient() {
  if (!isSupabaseEnabled) {
    return null;
  }

  return createBrowserClient(env.supabaseUrl, env.supabaseAnonKey);
}

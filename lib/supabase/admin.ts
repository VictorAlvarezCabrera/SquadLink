import { createClient } from "@supabase/supabase-js";

import { env, isSupabaseEnabled } from "@/lib/env";

export function createAdminSupabaseClient() {
  if (!isSupabaseEnabled || !env.supabaseServiceRoleKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

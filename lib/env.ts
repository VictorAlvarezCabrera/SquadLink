const appMode = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";

export const env = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  appMode,
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
};

export const isSupabaseEnabled =
  appMode === "supabase" && Boolean(env.supabaseUrl && env.supabaseAnonKey);

export const isDemoMode = !isSupabaseEnabled;

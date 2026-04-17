import { NotificationRow, ensureAuthedUser, ensureBootstrapProfile, isDemoMode } from "@/services/_shared";

export async function listNotifications() {
  const viewer = await ensureBootstrapProfile();

  if (isDemoMode) {
    return [
      {
        id: "demo-notification",
        profileId: viewer.id,
        title: "Modo demo",
        body: "Las notificaciones persistentes requieren Supabase.",
        isRead: false,
        readAt: null,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  const authed = await ensureAuthedUser();
  const { data } = await authed.supabase
    .from("notifications")
    .select("*")
    .eq("profile_id", viewer.id)
    .order("created_at", { ascending: false })
    .returns<NotificationRow[]>();

  return (data ?? []).map((row) => ({
    id: row.id,
    profileId: row.profile_id,
    title: row.title,
    body: row.body,
    isRead: row.is_read,
    readAt: row.read_at,
    createdAt: row.created_at,
  }));
}

export async function markNotificationAsRead(notificationId: string) {
  if (isDemoMode) {
    return { id: notificationId, isRead: true };
  }

  const authed = await ensureAuthedUser();
  const { data } = await authed.supabase
    .from("notifications")
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq("id", notificationId)
    .select("*")
    .single<NotificationRow>();

  return data;
}

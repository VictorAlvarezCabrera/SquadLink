import { requireViewer } from "@/lib/auth/session";
import { DashboardPage } from "@/features/dashboard/dashboard-page";

export default async function Page() {
  const viewer = await requireViewer();

  return <DashboardPage profileId={viewer.profile.id} />;
}

import { ClansPage } from "@/features/clans/clans-page";
import { listClans } from "@/services/squadlink-service";

export default async function Page() {
  const clans = await listClans();

  return <ClansPage clans={clans} />;
}

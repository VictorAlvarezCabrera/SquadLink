import { notFound } from "next/navigation";

import { ProfilePage } from "@/features/profiles/profile-page";
import { getProfileByNick } from "@/services/squadlink-service";

export default async function Page({ params }: { params: Promise<{ nick: string }> }) {
  const { nick } = await params;
  const profile = await getProfileByNick(nick);

  if (!profile) {
    notFound();
  }

  return <ProfilePage profile={profile} />;
}

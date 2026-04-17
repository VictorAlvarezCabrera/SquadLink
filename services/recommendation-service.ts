import { calculateCompatibility } from "@/lib/compatibility";

import { listClans } from "@/services/clan-service";
import { getViewerProfile } from "@/services/profile-service";
import { getProfileById } from "@/services/_shared";

export async function getRecommendationsForProfile(profileId?: string) {
  const profile = profileId ? await getProfileById(profileId) : await getViewerProfile();
  if (!profile) {
    return [];
  }

  const clans = await listClans();

  return clans
    .map((clan) => ({
      clan,
      result: calculateCompatibility(profile, clan),
    }))
    .sort((left, right) => right.result.score - left.result.score);
}

export async function getRecommendations(profileId: string) {
  return getRecommendationsForProfile(profileId);
}

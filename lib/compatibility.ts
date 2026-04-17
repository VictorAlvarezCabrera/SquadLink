import type { Clan, CompatibilityBreakdown, CompatibilityResult, Profile } from "@/types/domain";

function overlapMinutes(profile: Profile, clan: Clan) {
  const clanDays = clan.scheduleSummary.toLowerCase();
  return profile.availability.reduce((total, slot) => {
    const dayMatches = clanDays.includes(
      {
        mon: "lunes",
        tue: "martes",
        wed: "miércoles",
        thu: "jueves",
        fri: "viernes",
        sat: "sábado",
        sun: "domingo",
      }[slot.day]
    );

    if (!dayMatches) {
      return total;
    }

    const [fromHour, fromMinute] = slot.from.split(":").map(Number);
    const [toHour, toMinute] = slot.to.split(":").map(Number);
    return total + (toHour * 60 + toMinute - (fromHour * 60 + fromMinute));
  }, 0);
}

export function calculateCompatibility(profile: Profile, clan: Clan): CompatibilityResult {
  const scheduleMinutes = overlapMinutes(profile, clan);
  const schedule = Math.min(30, Math.round((scheduleMinutes / 360) * 30));

  const gameMatch = profile.favoriteGameIds.includes(clan.gameId) ? 15 : 0;
  const platformMatch = clan.preferredPlatforms.includes(profile.mainPlatform) ? 10 : 0;
  const gamePlatform = gameMatch + platformMatch;

  const matchingRoles = profile.gameplayRoles.filter((role) => clan.openRoles.includes(role)).length;
  const roleFit = Math.min(15, matchingRoles * 8);

  const sharedLanguages = profile.languages.filter((language) => clan.languages.includes(language)).length;
  const languageFit = Math.min(15, sharedLanguages * 8);

  const reliability = Math.round((profile.reliabilityScore / 100) * 15);

  const breakdown: CompatibilityBreakdown = {
    schedule,
    gamePlatform,
    roleFit,
    languageFit,
    reliability,
  };

  const score = Object.values(breakdown).reduce((sum, value) => sum + value, 0);

  let summary = "Compatibilidad moderada. Puede encajar con ajustes de agenda.";
  if (score >= 80) {
    summary = "Compatibilidad alta. Perfil muy alineado con la operativa del clan.";
  } else if (score >= 60) {
    summary = "Compatibilidad sólida. Buen encaje para probar solicitud o invitación.";
  }

  return { score, breakdown, summary };
}

import { describe, expect, it } from "vitest";

import {
  approveClanJoinRequest,
  createClan,
  createClanJoinRequest,
  createEvent,
  createLfgPost,
  getRecommendationsForProfile,
  rejectClanJoinRequest,
  respondToEventAttendance,
} from "@/services/squadlink-service";

describe("service flows in demo mode", () => {
  it("creates a clan with normalized slug", async () => {
    const clan = await createClan({
      name: "Equipo Táctico Alfa",
      tagline: "Clan competitivo de prueba para tests",
      description: "Clan de prueba suficientemente largo para pasar validación y probar creación.",
      visibility: "public",
      gameId: "game_valorant",
      preferredPlatforms: ["pc"],
      languages: ["es"],
      playstyle: "competitive",
      scheduleSummary: "Martes y jueves 21:00-23:00",
      requirements: ["Discord"],
      openRoles: ["controller"],
    });

    expect(clan?.slug).toBe("equipo-tactico-alfa");
  });

  it("creates and resolves a clan join request", async () => {
    const request = await createClanJoinRequest("nightwatch-protocol", "Quiero entrar y puedo cubrir sentinel.");

    expect(request.status).toBe("pending");

    const approved = await approveClanJoinRequest(request.id);
    const rejected = await rejectClanJoinRequest(request.id);

    expect(approved.status).toBe("approved");
    expect(rejected.status).toBe("rejected");
  });

  it("creates an event and responds attendance", async () => {
    const event = await createEvent({
      clanSlug: "nightwatch-protocol",
      title: "Entrenamiento de test",
      description: "Evento de prueba para verificar creación.",
      startsAt: new Date("2026-05-01T20:00:00Z").toISOString(),
      capacity: 5,
      visibility: "members_only",
    });

    expect(event?.title).toBe("Entrenamiento de test");

    const attendance = await respondToEventAttendance("event_1", "going");
    expect(attendance.status).toBe("going");
  });

  it("creates an LFG post", async () => {
    const post = await createLfgPost({
      gameId: "game_helldivers2",
      title: "LFG de integración",
      description: "Busco squad para runs coordinadas esta noche.",
      platforms: ["pc"],
      desiredRoles: ["support"],
      languages: ["es"],
      expiresAt: new Date("2026-05-01T23:00:00Z").toISOString(),
    });

    expect(post.title).toBe("LFG de integración");
  });

  it("returns recommendations sorted by score", async () => {
    const recommendations = await getRecommendationsForProfile("profile_marco");

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0]!.result.score).toBeGreaterThanOrEqual(recommendations.at(-1)!.result.score);
  });
});

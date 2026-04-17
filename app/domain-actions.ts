"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  approveClanJoinRequest,
  createClan,
  createClanJoinRequest,
  createEvent,
  createLfgPost,
  createReport,
  rejectClanJoinRequest,
  respondToEventAttendance,
  updateClan,
  updateLfgPost,
  updateMyProfile,
  updateReportStatus,
} from "@/services/squadlink-service";
import {
  clanApiSchema,
  clanJoinRequestApiSchema,
  eventApiSchema,
  lfgApiSchema,
  reportApiSchema,
  reportStatusApiSchema,
  updateProfileApiSchema,
} from "@/validations/api";

function parseCsv(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeDateTime(value: FormDataEntryValue | null) {
  const raw = String(value ?? "");
  return raw ? new Date(raw).toISOString() : raw;
}

export async function updateProfileAction(formData: FormData) {
  const input = updateProfileApiSchema.parse({
    nick: formData.get("nick"),
    fullName: formData.get("fullName"),
    bio: formData.get("bio"),
    avatarUrl: formData.get("avatarUrl") || undefined,
    mainPlatform: formData.get("mainPlatform"),
    languages: parseCsv(formData.get("languages")),
    favoriteGameIds: parseCsv(formData.get("favoriteGameIds")),
    gameplayRoles: parseCsv(formData.get("gameplayRoles")),
    reliabilityScore: Number(formData.get("reliabilityScore")),
    timezone: formData.get("timezone"),
    availability: [],
  });

  await updateMyProfile(input);
  revalidatePath("/perfil");
}

export async function createClanAction(formData: FormData) {
  const input = clanApiSchema.parse({
    name: formData.get("name"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    visibility: formData.get("visibility"),
    gameId: formData.get("gameId"),
    preferredPlatforms: parseCsv(formData.get("preferredPlatforms")),
    languages: parseCsv(formData.get("languages")),
    playstyle: formData.get("playstyle"),
    scheduleSummary: formData.get("scheduleSummary"),
    requirements: parseCsv(formData.get("requirements")),
    openRoles: parseCsv(formData.get("openRoles")),
  });

  const clan = await createClan(input);
  revalidatePath("/clanes");
  redirect(`/clanes/${clan?.slug ?? ""}`);
}

export async function updateClanAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const input = clanApiSchema.parse({
    name: formData.get("name"),
    tagline: formData.get("tagline"),
    description: formData.get("description"),
    visibility: formData.get("visibility"),
    gameId: formData.get("gameId"),
    preferredPlatforms: parseCsv(formData.get("preferredPlatforms")),
    languages: parseCsv(formData.get("languages")),
    playstyle: formData.get("playstyle"),
    scheduleSummary: formData.get("scheduleSummary"),
    requirements: parseCsv(formData.get("requirements")),
    openRoles: parseCsv(formData.get("openRoles")),
  });

  await updateClan(slug, input);
  revalidatePath(`/clanes/${slug}`);
  revalidatePath(`/clanes/${slug}/panel`);
}

export async function createClanJoinRequestAction(formData: FormData) {
  const slug = String(formData.get("slug") ?? "");
  const input = clanJoinRequestApiSchema.parse({
    message: formData.get("message"),
  });

  await createClanJoinRequest(slug, input.message);
  revalidatePath(`/clanes/${slug}`);
  revalidatePath(`/clanes/${slug}/solicitudes`);
}

export async function resolveClanRequestAction(formData: FormData) {
  const requestId = String(formData.get("requestId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const slug = String(formData.get("slug") ?? "");

  if (decision === "approve") {
    await approveClanJoinRequest(requestId);
  } else {
    await rejectClanJoinRequest(requestId);
  }

  revalidatePath(`/clanes/${slug}/solicitudes`);
  revalidatePath(`/clanes/${slug}/panel`);
}

export async function createEventAction(formData: FormData) {
  const input = eventApiSchema.parse({
    clanSlug: formData.get("clanSlug"),
    title: formData.get("title"),
    description: formData.get("description"),
    startsAt: normalizeDateTime(formData.get("startsAt")),
    capacity: Number(formData.get("capacity")),
    visibility: formData.get("visibility"),
  });

  const event = await createEvent({
    clanSlug: input.clanSlug!,
    title: input.title,
    description: input.description,
    startsAt: input.startsAt,
    capacity: input.capacity,
    visibility: input.visibility,
  });

  revalidatePath("/eventos");
  redirect(`/eventos/${event?.id ?? ""}`);
}

export async function respondAttendanceAction(formData: FormData) {
  const eventId = String(formData.get("eventId") ?? "");
  const status = String(formData.get("status") ?? "") as "going" | "maybe" | "declined";
  await respondToEventAttendance(eventId, status);
  revalidatePath(`/eventos/${eventId}`);
}

export async function createLfgAction(formData: FormData) {
  const input = lfgApiSchema.parse({
    gameId: formData.get("gameId"),
    title: formData.get("title"),
    description: formData.get("description"),
    platforms: parseCsv(formData.get("platforms")),
    desiredRoles: parseCsv(formData.get("desiredRoles")),
    languages: parseCsv(formData.get("languages")),
    expiresAt: normalizeDateTime(formData.get("expiresAt")),
  });

  await createLfgPost(input);
  revalidatePath("/lfg");
}

export async function updateLfgAction(formData: FormData) {
  const lfgId = String(formData.get("lfgId") ?? "");
  const input = lfgApiSchema.parse({
    gameId: formData.get("gameId"),
    title: formData.get("title"),
    description: formData.get("description"),
    platforms: parseCsv(formData.get("platforms")),
    desiredRoles: parseCsv(formData.get("desiredRoles")),
    languages: parseCsv(formData.get("languages")),
    expiresAt: normalizeDateTime(formData.get("expiresAt")),
  });

  await updateLfgPost(lfgId, input);
  revalidatePath("/lfg");
}

export async function createReportAction(formData: FormData) {
  const input = reportApiSchema.parse({
    targetType: formData.get("targetType"),
    targetId: formData.get("targetId"),
    reason: formData.get("reason"),
    details: formData.get("details"),
  });

  await createReport(input);
  revalidatePath("/admin/reportes");
}

export async function updateReportStatusAction(formData: FormData) {
  const reportId = String(formData.get("reportId") ?? "");
  const input = reportStatusApiSchema.parse({
    status: formData.get("status"),
  });

  await updateReportStatus(reportId, input.status);
  revalidatePath("/admin");
  revalidatePath("/admin/reportes");
}

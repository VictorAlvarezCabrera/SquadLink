import { profiles as demoProfiles, reports as demoReports } from "@/data/demo";
import { AppError } from "@/lib/app-error";
import type { ReportStatus } from "@/types/domain";

import { ReportRow, assertAdmin, ensureAuthedUser, ensureBootstrapProfile, getProfileById, isDemoMode } from "@/services/_shared";

export interface ReportInput {
  targetType: "profile" | "clan" | "lfg_post";
  targetId: string;
  reason: string;
  details: string;
}

export async function listReports() {
  if (isDemoMode) {
    return demoReports.map((report) => ({
      ...report,
      reporter: demoProfiles.find((profile) => profile.id === report.reporterProfileId)!,
    }));
  }

  const viewer = await ensureBootstrapProfile();
  const authed = await ensureAuthedUser();
  const { data } =
    viewer.role === "admin"
      ? await authed.supabase.from("reports").select("*").order("created_at", { ascending: false }).returns<ReportRow[]>()
      : await authed.supabase
          .from("reports")
          .select("*")
          .eq("reporter_profile_id", viewer.id)
          .order("created_at", { ascending: false })
          .returns<ReportRow[]>();

  return Promise.all(
    (data ?? []).map(async (report) => ({
      id: report.id,
      reporterProfileId: report.reporter_profile_id,
      targetType: report.target_type,
      targetId: report.target_id,
      reason: report.reason,
      details: report.details,
      status: report.status,
      createdAt: report.created_at,
      reporter: await getProfileById(report.reporter_profile_id),
    }))
  );
}

export async function createReport(input: ReportInput) {
  const viewer = await ensureBootstrapProfile();

  if (isDemoMode) {
    return {
      id: `demo-report-${Date.now()}`,
      reporterProfileId: viewer.id,
      targetType: input.targetType,
      targetId: input.targetId,
      reason: input.reason,
      details: input.details,
      status: "open" as const,
      createdAt: new Date().toISOString(),
    };
  }

  const authed = await ensureAuthedUser();
  const { data, error } = await authed.supabase
    .from("reports")
    .insert({
      reporter_profile_id: viewer.id,
      target_type: input.targetType,
      target_id: input.targetId,
      reason: input.reason,
      details: input.details,
      status: "open",
    })
    .select("*")
    .single<ReportRow>();

  if (error || !data) {
    throw new AppError(error?.message ?? "No se pudo crear el reporte.", 400);
  }

  return data;
}

export async function updateReportStatus(reportId: string, status: ReportStatus) {
  await assertAdmin();

  if (isDemoMode) {
    return { id: reportId, status };
  }

  const authed = await ensureAuthedUser();
  const { data, error } = await authed.supabase
    .from("reports")
    .update({ status })
    .eq("id", reportId)
    .select("*")
    .single<ReportRow>();

  if (error || !data) {
    throw new AppError(error?.message ?? "No se pudo actualizar el reporte.", 400);
  }

  return data;
}

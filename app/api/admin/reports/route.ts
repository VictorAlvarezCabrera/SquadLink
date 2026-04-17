import { apiError, apiSuccess } from "@/lib/api";
import { listReports } from "@/services/report-service";

export async function GET() {
  try {
    return apiSuccess(await listReports());
  } catch (error) {
    return apiError(error);
  }
}

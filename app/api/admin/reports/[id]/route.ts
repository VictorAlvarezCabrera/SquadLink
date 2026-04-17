import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { updateReportStatus } from "@/services/report-service";
import { reportStatusApiSchema } from "@/validations/api";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const input = await parseJson(request, reportStatusApiSchema);
    return apiSuccess(await updateReportStatus(id, input.status));
  } catch (error) {
    return apiError(error);
  }
}

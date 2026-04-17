import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { createReport } from "@/services/report-service";
import { reportApiSchema } from "@/validations/api";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, reportApiSchema);
    return apiSuccess(await createReport(input), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

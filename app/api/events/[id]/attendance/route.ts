import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { respondToEventAttendance } from "@/services/event-service";
import { eventAttendanceApiSchema } from "@/validations/api";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const input = await parseJson(request, eventAttendanceApiSchema);
    return apiSuccess(await respondToEventAttendance(id, input.status));
  } catch (error) {
    return apiError(error);
  }
}

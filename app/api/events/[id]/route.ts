import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { getEventById, updateEvent } from "@/services/event-service";
import { eventApiSchema } from "@/validations/api";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    return apiSuccess(await getEventById(id));
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const input = await parseJson(request, eventApiSchema.omit({ clanSlug: true }));
    return apiSuccess(await updateEvent(id, input));
  } catch (error) {
    return apiError(error);
  }
}

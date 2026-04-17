import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { createEvent } from "@/services/event-service";
import { eventApiSchema } from "@/validations/api";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const input = await parseJson(request, eventApiSchema.omit({ clanSlug: true }));
    return apiSuccess(await createEvent({ ...input, clanSlug: slug }), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

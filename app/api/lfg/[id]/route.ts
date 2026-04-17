import { apiError, apiSuccess } from "@/lib/api";
import { closeLfgPost, updateLfgPost } from "@/services/lfg-service";
import { lfgApiSchema } from "@/validations/api";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (body?.close === true) {
      return apiSuccess(await closeLfgPost(id));
    }

    const input = lfgApiSchema.parse(body);
    return apiSuccess(await updateLfgPost(id, input));
  } catch (error) {
    return apiError(error);
  }
}

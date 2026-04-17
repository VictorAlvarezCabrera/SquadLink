import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { getClanBySlug, updateClan } from "@/services/clan-service";
import { clanApiSchema } from "@/validations/api";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    return apiSuccess(await getClanBySlug(slug));
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const input = await parseJson(request, clanApiSchema);
    return apiSuccess(await updateClan(slug, input));
  } catch (error) {
    return apiError(error);
  }
}

import { apiError, apiSuccess } from "@/lib/api";
import { getGameOffers } from "@/services/catalog-service";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    return apiSuccess(await getGameOffers(slug));
  } catch (error) {
    return apiError(error);
  }
}

import { apiError, apiSuccess } from "@/lib/api";
import { getRecommendationsForProfile } from "@/services/recommendation-service";

export async function GET() {
  try {
    return apiSuccess(await getRecommendationsForProfile());
  } catch (error) {
    return apiError(error);
  }
}

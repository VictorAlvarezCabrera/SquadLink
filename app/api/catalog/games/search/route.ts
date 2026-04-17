import { apiError, apiSuccess } from "@/lib/api";
import { searchGames } from "@/services/catalog-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    return apiSuccess(await searchGames(searchParams.get("q") ?? ""));
  } catch (error) {
    return apiError(error);
  }
}

import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { syncGameCatalog } from "@/services/catalog-service";
import { catalogSyncApiSchema } from "@/validations/api";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, catalogSyncApiSchema);
    return apiSuccess(await syncGameCatalog(input.query));
  } catch (error) {
    return apiError(error);
  }
}

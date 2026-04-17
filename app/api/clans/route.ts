import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { createClan, listClans } from "@/services/clan-service";
import { clanApiSchema } from "@/validations/api";

export async function GET() {
  try {
    return apiSuccess(await listClans());
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, clanApiSchema);
    return apiSuccess(await createClan(input), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

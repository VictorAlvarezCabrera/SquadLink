import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { createClanJoinRequest, listClanJoinRequests } from "@/services/clan-service";
import { clanJoinRequestApiSchema } from "@/validations/api";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    return apiSuccess(await listClanJoinRequests(slug));
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await context.params;
    const input = await parseJson(request, clanJoinRequestApiSchema);
    return apiSuccess(await createClanJoinRequest(slug, input.message), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

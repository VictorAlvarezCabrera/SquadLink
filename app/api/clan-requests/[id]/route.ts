import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { approveClanJoinRequest, rejectClanJoinRequest } from "@/services/clan-service";
import { clanRequestDecisionApiSchema } from "@/validations/api";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const input = await parseJson(request, clanRequestDecisionApiSchema);
    const result = input.action === "approve" ? await approveClanJoinRequest(id) : await rejectClanJoinRequest(id);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}

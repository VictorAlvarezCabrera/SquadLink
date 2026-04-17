import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { getViewerProfile, updateMyProfile } from "@/services/profile-service";
import { updateProfileApiSchema } from "@/validations/api";

export async function GET() {
  try {
    const profile = await getViewerProfile();
    return apiSuccess(profile);
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const input = await parseJson(request, updateProfileApiSchema);
    const profile = await updateMyProfile(input);
    return apiSuccess(profile);
  } catch (error) {
    return apiError(error);
  }
}

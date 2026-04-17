import { apiError, apiSuccess, parseJson } from "@/lib/api";
import { createLfgPost, listLfgPosts } from "@/services/lfg-service";
import { lfgApiSchema } from "@/validations/api";

export async function GET() {
  try {
    return apiSuccess(await listLfgPosts());
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, lfgApiSchema);
    return apiSuccess(await createLfgPost(input), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

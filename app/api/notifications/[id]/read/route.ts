import { apiError, apiSuccess } from "@/lib/api";
import { markNotificationAsRead } from "@/services/notification-service";

export async function PATCH(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    return apiSuccess(await markNotificationAsRead(id));
  } catch (error) {
    return apiError(error);
  }
}

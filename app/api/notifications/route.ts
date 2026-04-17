import { apiError, apiSuccess } from "@/lib/api";
import { listNotifications } from "@/services/notification-service";

export async function GET() {
  try {
    return apiSuccess(await listNotifications());
  } catch (error) {
    return apiError(error);
  }
}

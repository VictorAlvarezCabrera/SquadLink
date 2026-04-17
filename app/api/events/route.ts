import { apiError, apiSuccess } from "@/lib/api";
import { listEvents } from "@/services/event-service";

export async function GET() {
  try {
    return apiSuccess(await listEvents());
  } catch (error) {
    return apiError(error);
  }
}

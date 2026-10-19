import { z } from "zod";
import type { ApiEnv } from "@/lib/env";
import type { AppointmentRepository } from "./types";

const ENQUIRIES_PATH = "/api/v1/public/enquiries";

const responseSchema = z.object({
  success: z.literal(true),
  data: z.object({ referenceId: z.string().trim().min(1) }),
});

/**
 * Stores the request in the backend's website-enquiries inbox (`POST /public/enquiries`),
 * where staff follow it up in the admin console. The backend issues the reference id.
 * Choices are sent as the labels the visitor saw.
 */
export function createEnquiryRepository({ baseUrl, siteKey }: ApiEnv): AppointmentRepository {
  return {
    channel: "backend",
    async save(request, context) {
      const response = await fetch(`${baseUrl}${ENQUIRIES_PATH}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...(siteKey ? { "x-site-key": siteKey } : {}),
        },
        // JSON.stringify drops the undefined (optional) fields.
        body: JSON.stringify({
          name: request.name,
          phone: request.phone,
          treatment: request.treatment?.label,
          visitType: request.visitType?.label,
          preferredDate: request.preferredDate,
          preferredTime: request.preferredTime?.label,
          message: request.message,
          referencePrefix: context.referencePrefix || undefined,
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) throw new Error(`Enquiry API responded ${response.status}`);

      const parsed = responseSchema.safeParse(await response.json());
      if (!parsed.success) throw new Error("Enquiry API returned an unexpected body");
      return { referenceId: parsed.data.data.referenceId };
    },
  };
}

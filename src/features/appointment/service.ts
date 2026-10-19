import "server-only";
import { getApiEnv, getNotifierEnv } from "@/lib/env";
import { createEnquiryRepository } from "./enquiry-repository";
import { createNotifiersFromEnv } from "./notifiers";
import type { AppointmentRequest } from "./schema";
import type {
  Appointment,
  AppointmentNotifier,
  AppointmentRepository,
  BookingContext,
  BookingResult,
} from "./types";

interface AppointmentServiceDeps {
  repository: AppointmentRepository;
  notifiers: readonly AppointmentNotifier[];
  generateReferenceId?: (prefix: string) => string;
  now?: () => Date;
}

/** Reference prefix from the CMS monogram, in the form the backend accepts (`[A-Z0-9]{1,6}`, or "" for its default). */
export const toReferencePrefix = (monogram: string) =>
  monogram.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

/** Fallback reference when the backend cannot issue one, e.g. "MC-3F9A1C". */
export const localReferenceId = (prefix: string) =>
  `${prefix || "REF"}-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

/**
 * Application service for booking. Pure orchestration — no HTTP, no form
 * parsing, no framework imports — so it is trivially unit-testable with fakes.
 *
 * 1. The repository (backend enquiries inbox) stores the request and issues its reference.
 *    If it fails, a local reference is generated and the patient is asked to confirm
 *    on WhatsApp / by phone instead.
 * 2. Every notifier is then told in parallel; one failing channel never blocks the others.
 */
export function createAppointmentService({
  repository,
  notifiers,
  generateReferenceId = localReferenceId,
  now = () => new Date(),
}: AppointmentServiceDeps) {
  return {
    async book(request: AppointmentRequest, context: BookingContext): Promise<BookingResult> {
      let referenceId: string;
      let delivered = false;

      try {
        ({ referenceId } = await repository.save(request, context));
        delivered = true;
      } catch (error) {
        referenceId = generateReferenceId(context.referencePrefix);
        console.error(`[appointments] ${repository.channel} failed; using local reference ${referenceId}`, error);
      }

      const appointment: Appointment = { ...request, referenceId, createdAt: now().toISOString() };
      const results = await Promise.allSettled(notifiers.map((n) => n.notify(appointment, context)));

      results.forEach((result, index) => {
        const notifier = notifiers[index];
        if (result.status === "rejected") {
          console.error(`[appointments] ${notifier.channel} failed for ${referenceId}`, result.reason);
        } else if (notifier.reachesClinic) {
          delivered = true;
        }
      });

      return { appointment, delivered };
    },
  };
}

export type AppointmentService = ReturnType<typeof createAppointmentService>;

let instance: AppointmentService | undefined;

/** Composition root — wires the service with the backend repository and env-configured notifiers. */
export function getAppointmentService(): AppointmentService {
  instance ??= createAppointmentService({
    repository: createEnquiryRepository(getApiEnv()),
    notifiers: createNotifiersFromEnv(getNotifierEnv()),
  });
  return instance;
}

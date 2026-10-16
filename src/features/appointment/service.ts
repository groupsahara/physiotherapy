import "server-only";
import { getServerEnv } from "@/lib/env";
import { createNotifiersFromEnv } from "./notifiers";
import type { AppointmentRequest } from "./schema";
import type { Appointment, AppointmentNotifier, BookingResult } from "./types";

interface AppointmentServiceDeps {
  notifiers: readonly AppointmentNotifier[];
  generateReferenceId?: () => string;
  now?: () => Date;
}

const defaultReferenceId = () => `MC-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;

/**
 * Application service for booking. Pure orchestration — no HTTP, no form
 * parsing, no framework imports — so it is trivially unit-testable with fake
 * notifiers. A persistence step (DB/CRM repository) slots in before fan-out.
 */
export function createAppointmentService({
  notifiers,
  generateReferenceId = defaultReferenceId,
  now = () => new Date(),
}: AppointmentServiceDeps) {
  return {
    async book(request: AppointmentRequest): Promise<BookingResult> {
      const appointment: Appointment = {
        ...request,
        referenceId: generateReferenceId(),
        createdAt: now().toISOString(),
      };

      // Fan out to every channel; one failing channel must not block the others.
      const results = await Promise.allSettled(notifiers.map((n) => n.notify(appointment)));

      let delivered = false;
      results.forEach((result, index) => {
        const notifier = notifiers[index];
        if (result.status === "rejected") {
          console.error(`[appointments] ${notifier.channel} failed for ${appointment.referenceId}`, result.reason);
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

/** Composition root — wires the service with notifiers built from env. */
export function getAppointmentService(): AppointmentService {
  instance ??= createAppointmentService({ notifiers: createNotifiersFromEnv(getServerEnv()) });
  return instance;
}

import type { NotifierEnv } from "@/lib/env";
import type { AppointmentNotifier } from "../types";
import { createConsoleNotifier } from "./console-notifier";
import { createEmailNotifier } from "./email-notifier";
import { createWebhookNotifier } from "./webhook-notifier";

/** Factory: builds the optional extra notifier chain from configuration. */
export function createNotifiersFromEnv(env: NotifierEnv): AppointmentNotifier[] {
  const notifiers: AppointmentNotifier[] = [createConsoleNotifier()];

  if (env.RESEND_API_KEY) {
    notifiers.push(
      createEmailNotifier({
        apiKey: env.RESEND_API_KEY,
        from: env.APPOINTMENT_EMAIL_FROM,
        to: env.APPOINTMENT_EMAIL_TO,
      }),
    );
  }

  if (env.APPOINTMENT_WEBHOOK_URL) {
    notifiers.push(createWebhookNotifier(env.APPOINTMENT_WEBHOOK_URL));
  }

  return notifiers;
}

import { formatStaffSummary } from "../message";
import type { AppointmentNotifier } from "../types";

interface EmailNotifierOptions {
  apiKey: string;
  /** Defaults to "<clinic name> <onboarding@resend.dev>". */
  from?: string;
  /** Defaults to the clinic email from the CMS. */
  to?: string;
}

/** Sends the booking to the clinic inbox via Resend's REST API (no SDK needed). */
export function createEmailNotifier({ apiKey, from, to }: EmailNotifierOptions): AppointmentNotifier {
  return {
    channel: "email",
    reachesClinic: true,
    async notify(appointment, context) {
      const recipient = to ?? context.clinicEmail;
      if (!recipient) throw new Error("No recipient: set APPOINTMENT_EMAIL_TO or the clinic email in the CMS");

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: from ?? `${context.clinicName || "Website"} <onboarding@resend.dev>`,
          to: [recipient],
          subject: `New appointment: ${appointment.name} (${appointment.referenceId})`,
          text: formatStaffSummary(appointment, context),
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) throw new Error(`Resend responded ${response.status}`);
    },
  };
}

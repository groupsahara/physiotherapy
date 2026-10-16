import { formatStaffSummary } from "../message";
import type { AppointmentNotifier } from "../types";

interface EmailNotifierOptions {
  apiKey: string;
  from: string;
  to: string;
}

/** Sends the booking to the clinic inbox via Resend's REST API (no SDK needed). */
export function createEmailNotifier({ apiKey, from, to }: EmailNotifierOptions): AppointmentNotifier {
  return {
    channel: "email",
    reachesClinic: true,
    async notify(appointment) {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          subject: `New appointment: ${appointment.name} (${appointment.referenceId})`,
          text: formatStaffSummary(appointment),
        }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) throw new Error(`Resend responded ${response.status}`);
    },
  };
}

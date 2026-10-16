import { formatStaffSummary } from "../message";
import type { AppointmentNotifier } from "../types";

/**
 * Generic JSON webhook. `text` makes it work as-is with Slack/Discord
 * incoming webhooks; `appointment` carries structured data for Zapier,
 * Make or a Google Apps Script that appends to a Sheet.
 */
export function createWebhookNotifier(url: string): AppointmentNotifier {
  return {
    channel: "webhook",
    reachesClinic: true,
    async notify(appointment) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: formatStaffSummary(appointment), appointment }),
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
    },
  };
}

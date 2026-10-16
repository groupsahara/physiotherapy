import type { AppointmentNotifier } from "../types";

/** Always-on audit trail in server logs. Phone is masked to keep PII out of logs. */
export function createConsoleNotifier(): AppointmentNotifier {
  return {
    channel: "console",
    reachesClinic: false,
    async notify(appointment) {
      const maskedPhone = appointment.phone.replace(/\d(?=\d{3})/g, "•");
      console.info(
        `[appointments] ${appointment.referenceId} · ${appointment.service} · ${appointment.visitType} · ${maskedPhone}`,
      );
    },
  };
}

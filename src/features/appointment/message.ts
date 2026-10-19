import { formatISODate } from "@/lib/date";
import type { Appointment, BookingContext } from "./types";

/** Human-readable lines describing an appointment — shared by every channel. */
export function describeAppointment(appointment: Appointment, language: string): string[] {
  const when = [
    appointment.preferredDate ? formatISODate(appointment.preferredDate, language) : "Flexible date",
    appointment.preferredTime?.label,
  ]
    .filter(Boolean)
    .join(" · ");

  return [
    `Name: ${appointment.name}`,
    `Phone: ${appointment.phone}`,
    ...(appointment.treatment ? [`Treatment: ${appointment.treatment.label}`] : []),
    ...(appointment.visitType ? [`Visit: ${appointment.visitType.label}`] : []),
    `Preferred: ${when}`,
    ...(appointment.message ? [`Note: ${appointment.message}`] : []),
    `Ref: ${appointment.referenceId}`,
  ];
}

/** Staff-facing summary used by email and webhook notifiers. */
export function formatStaffSummary(appointment: Appointment, context: BookingContext): string {
  const title = context.clinicName ? `New appointment request — ${context.clinicName}` : "New appointment request";
  return [title, "", ...describeAppointment(appointment, context.language)].join("\n");
}

/** Pre-filled message the patient can send to the clinic on WhatsApp, opening with the CMS greeting. */
export function formatPatientWhatsAppMessage(appointment: Appointment, greeting: string, language: string): string {
  return [...(greeting ? [greeting, ""] : []), ...describeAppointment(appointment, language)].join("\n");
}

import { siteConfig } from "@/config/site";
import { formatISODate } from "@/lib/date";
import { appointmentServiceOptions, labelFor, timeSlotOptions, visitTypeOptions } from "./constants";
import type { Appointment } from "./types";

/** Human-readable lines describing an appointment — shared by every channel. */
export function describeAppointment(appointment: Appointment): string[] {
  const when = [
    appointment.preferredDate ? formatISODate(appointment.preferredDate) : "Flexible date",
    labelFor(timeSlotOptions, appointment.preferredSlot),
  ].join(" · ");

  return [
    `Name: ${appointment.name}`,
    `Phone: ${appointment.phone}`,
    `Treatment: ${labelFor(appointmentServiceOptions, appointment.service)}`,
    `Visit: ${labelFor(visitTypeOptions, appointment.visitType)}`,
    `Preferred: ${when}`,
    ...(appointment.message ? [`Note: ${appointment.message}`] : []),
    `Ref: ${appointment.referenceId}`,
  ];
}

/** Staff-facing summary used by email and webhook notifiers. */
export function formatStaffSummary(appointment: Appointment): string {
  return [`New appointment request — ${siteConfig.name}`, "", ...describeAppointment(appointment)].join("\n");
}

/** Pre-filled message the patient can send to the clinic on WhatsApp. */
export function formatPatientWhatsAppMessage(appointment: Appointment): string {
  return [
    `Hello ${siteConfig.name}, I'd like to book a physiotherapy appointment.`,
    "",
    ...describeAppointment(appointment),
  ].join("\n");
}

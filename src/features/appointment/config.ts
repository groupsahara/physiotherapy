import type { SelectOption, Site, VisitTypeOption } from "@/lib/cms/types";
import { resolveTimeZone } from "@/lib/date";

/**
 * Appointment-form configuration derived from the CMS. Shared by the client form
 * (options, copy) and the server action (validation), so both always agree.
 * Kept free of zod so the client bundle stays small.
 */

export const APPOINTMENT_FIELDS = [
  "name",
  "phone",
  "treatment",
  "visitType",
  "preferredDate",
  "preferredTime",
  "message",
] as const;
export type AppointmentField = (typeof APPOINTMENT_FIELDS)[number];

/** Hidden honeypot input: people never fill it, bots usually do. */
export const HONEYPOT_FIELD = "company";

export const NAME_MAX_LENGTH = 80;

/** Value of the "not sure" treatment option; can never clash with a slug (slugs have no "_"). */
export const UNSURE_TREATMENT_VALUE = "_unsure";

/** Technical ceilings applied when the CMS leaves a limit empty (match the CMS field maxima). */
const MAX_DAYS_AHEAD_LIMIT = 365;
const MESSAGE_LENGTH_LIMIT = 2000;

export interface AppointmentFormConfig {
  /** Treatments from the CMS plus the optional "not sure" option. */
  treatments: SelectOption[];
  visitTypes: VisitTypeOption[];
  /** The first one is pre-selected. */
  timeSlots: SelectOption[];
  maxDaysAhead: number;
  messageMaxLength: number;
  messagePlaceholder: string;
  submitLabel: string;
  footnote: string;
  successMessage: string;
  fallbackMessage: string;
  /** IANA zone used for "today" in the date picker and validation. */
  timeZone: string;
}

function limit(value: number | null, max: number): number {
  return value === null || !Number.isFinite(value) ? max : Math.min(Math.max(Math.trunc(value), 1), max);
}

export function buildAppointmentFormConfig(site: Site): AppointmentFormConfig {
  const form = site.documents["booking.form"];
  const treatments: SelectOption[] = site.collections.treatments.map(({ slug, title }) => ({ value: slug, label: title }));
  if (form.unsureOptionLabel) treatments.push({ value: UNSURE_TREATMENT_VALUE, label: form.unsureOptionLabel });

  return {
    treatments,
    visitTypes: form.visitTypes,
    timeSlots: form.timeSlots,
    maxDaysAhead: limit(form.maxDaysAhead, MAX_DAYS_AHEAD_LIMIT),
    messageMaxLength: limit(form.messageMaxLength, MESSAGE_LENGTH_LIMIT),
    messagePlaceholder: form.messagePlaceholder,
    submitLabel: form.submitLabel,
    footnote: form.footnote,
    successMessage: form.successMessage,
    fallbackMessage: form.fallbackMessage,
    timeZone: resolveTimeZone(site.documents["site.identity"].timeZone),
  };
}

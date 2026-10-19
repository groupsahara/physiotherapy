import { z } from "zod";
import type { SelectOption } from "@/lib/cms/types";
import { addDaysISO, todayISO } from "@/lib/date";
import { NAME_MAX_LENGTH, type AppointmentFormConfig } from "./config";

/** Accepts "98765 43210", "+91-9876543210", "09876543210" … → "9876543210" or null. */
export function normalizeIndianMobile(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

/** Resolves a submitted value to the option the visitor picked (value + label). */
function choice(options: readonly SelectOption[], message: string) {
  return z
    .string()
    .trim()
    .transform((value, ctx): SelectOption | undefined => {
      // Nothing to choose from (the CMS offers no options): the field is skipped.
      if (options.length === 0) return undefined;
      const option = options.find((candidate) => candidate.value === value);
      if (!option) {
        ctx.addIssue({ code: "custom", message });
        return z.NEVER;
      }
      return { value: option.value, label: option.label };
    });
}

/**
 * Builds the validation schema from the current CMS form configuration, so options,
 * the booking window and the message limit always match what the form offers.
 */
export function createAppointmentSchema(config: AppointmentFormConfig) {
  const { maxDaysAhead, messageMaxLength, timeSlots, timeZone } = config;

  return z.object({
    name: z
      .string()
      .trim()
      .min(2, "Please enter your full name.")
      .max(NAME_MAX_LENGTH, "Name is too long."),
    phone: z
      .string()
      .trim()
      .transform((value, ctx) => {
        const mobile = normalizeIndianMobile(value);
        if (!mobile) {
          ctx.addIssue({ code: "custom", message: "Enter a valid 10-digit mobile number." });
          return z.NEVER;
        }
        return `+91${mobile}`;
      }),
    treatment: choice(config.treatments, "Please choose a treatment."),
    visitType: choice(config.visitTypes, "Please choose a visit type."),
    preferredDate: z
      .string()
      .trim()
      .transform((value) => value || undefined)
      .refine((value) => value === undefined || /^\d{4}-\d{2}-\d{2}$/.test(value), "Pick a valid date.")
      .refine((value) => {
        if (value === undefined) return true;
        const today = todayISO(timeZone);
        return value >= today && value <= addDaysISO(today, maxDaysAhead);
      }, `Choose a date between today and the next ${maxDaysAhead} days.`),
    // An unknown slot falls back to the default (first) one rather than failing the request.
    preferredTime: z
      .string()
      .trim()
      .transform((value): SelectOption | undefined => {
        const option = timeSlots.find((candidate) => candidate.value === value) ?? timeSlots[0];
        return option && { value: option.value, label: option.label };
      }),
    message: z
      .string()
      .trim()
      .max(messageMaxLength, `Please keep the message under ${messageMaxLength} characters.`)
      .transform((value) => value || undefined),
  });
}

export type AppointmentRequest = z.output<ReturnType<typeof createAppointmentSchema>>;

import { z } from "zod";
import { siteConfig } from "@/config/site";
import { addDaysISO, todayISO } from "@/lib/date";
import {
  MAX_BOOKING_DAYS_AHEAD,
  MESSAGE_MAX_LENGTH,
  appointmentServiceOptions,
  timeSlotOptions,
  visitTypeOptions,
  type ServiceValue,
  type TimeSlot,
  type VisitType,
} from "./constants";

const values = <T extends string>(options: readonly { value: T }[]) =>
  options.map((option) => option.value) as [T, ...T[]];

/** Accepts "98765 43210", "+91-9876543210", "09876543210" … → "9876543210" or null. */
export function normalizeIndianMobile(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export const appointmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name.")
    .max(80, "Name is too long."),
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
  service: z.enum(values<ServiceValue>(appointmentServiceOptions), {
    error: "Please choose a treatment.",
  }),
  visitType: z.enum(values<VisitType>(visitTypeOptions), {
    error: "Choose clinic or home visit.",
  }),
  preferredDate: z
    .string()
    .trim()
    .transform((value) => value || undefined)
    .refine((value) => value === undefined || /^\d{4}-\d{2}-\d{2}$/.test(value), "Pick a valid date.")
    .refine((value) => {
      if (value === undefined) return true;
      const today = todayISO(siteConfig.timeZone);
      return value >= today && value <= addDaysISO(today, MAX_BOOKING_DAYS_AHEAD);
    }, `Choose a date between today and the next ${MAX_BOOKING_DAYS_AHEAD} days.`),
  preferredSlot: z.enum(values<TimeSlot>(timeSlotOptions)).catch("any"),
  message: z
    .string()
    .trim()
    .max(MESSAGE_MAX_LENGTH, `Please keep the message under ${MESSAGE_MAX_LENGTH} characters.`)
    .transform((value) => value || undefined),
});

export type AppointmentRequest = z.output<typeof appointmentSchema>;
export type AppointmentField = keyof z.input<typeof appointmentSchema>;

export const appointmentFields = Object.keys(appointmentSchema.shape) as AppointmentField[];

import { serviceOptions } from "@/content/services";

/**
 * Option lists shared by the client form and the server-side schema.
 * Kept free of zod so the client bundle stays small.
 */

export const appointmentServiceOptions = [
  ...serviceOptions,
  { value: "not-sure", label: "Not sure — need an assessment" },
] as const;

export const visitTypeOptions = [
  { value: "clinic", label: "Clinic visit", hint: "Vishwas Nagar, Delhi" },
  { value: "home", label: "Home visit", hint: "We come to you" },
] as const;

export const timeSlotOptions = [
  { value: "any", label: "Any time" },
  { value: "morning", label: "Morning" },
  { value: "afternoon", label: "Afternoon" },
  { value: "evening", label: "Evening" },
] as const;

export type ServiceValue = (typeof appointmentServiceOptions)[number]["value"];
export type VisitType = (typeof visitTypeOptions)[number]["value"];
export type TimeSlot = (typeof timeSlotOptions)[number]["value"];

export const MAX_BOOKING_DAYS_AHEAD = 90;
export const MESSAGE_MAX_LENGTH = 500;

export const labelFor = <T extends { value: string; label: string }>(
  options: readonly T[],
  value: string,
) => options.find((option) => option.value === value)?.label ?? value;

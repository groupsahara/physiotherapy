"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { siteConfig } from "@/config/site";
import { whatsappHref } from "@/lib/contact-links";
import { createRateLimiter } from "@/lib/rate-limit";
import { formatPatientWhatsAppMessage } from "./message";
import { appointmentFields, appointmentSchema, type AppointmentField } from "./schema";
import { getAppointmentService } from "./service";
import type { AppointmentFormState, FieldErrors, FieldValues } from "./types";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
const HONEYPOT_FIELD = "company";

/**
 * Server Action (controller). Translates FormData ⇄ view-model and delegates
 * the business work to the appointment service.
 */
export async function requestAppointment(
  _previous: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const values = readFields(formData);

  // Bots fill every field. Pretend success so they don't retry.
  if (formData.get(HONEYPOT_FIELD)) {
    return { status: "success", referenceId: "MC-000000", delivered: true, whatsappUrl: "#", patientName: "" };
  }

  const requestHeaders = await headers();
  const clientIp = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  if (!limiter.check(clientIp).allowed) {
    return {
      status: "error",
      message: `Too many requests from this device. Please call us on ${siteConfig.contact.phones[0].display}.`,
      values,
    };
  }

  const parsed = appointmentSchema.safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  try {
    const { appointment, delivered } = await getAppointmentService().book(parsed.data);
    return {
      status: "success",
      referenceId: appointment.referenceId,
      delivered,
      patientName: appointment.name.split(" ")[0],
      whatsappUrl: whatsappHref(siteConfig.contact.whatsapp, formatPatientWhatsAppMessage(appointment)),
    };
  } catch (error) {
    console.error("[appointments] booking failed", error);
    return {
      status: "error",
      message: `Something went wrong on our side. Please call ${siteConfig.contact.phones[0].display} to book.`,
      values,
    };
  }
}

function readFields(formData: FormData): FieldValues {
  return Object.fromEntries(
    appointmentFields.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  );
}

function toFieldErrors(error: z.ZodError): FieldErrors {
  const { fieldErrors } = z.flattenError(error);
  const result: FieldErrors = {};
  for (const [field, messages] of Object.entries(fieldErrors) as [AppointmentField, string[] | undefined][]) {
    if (messages?.[0]) result[field] = messages[0];
  }
  return result;
}

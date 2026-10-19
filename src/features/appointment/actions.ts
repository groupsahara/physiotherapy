"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { getSite } from "@/lib/cms/get-site";
import { primaryPhone } from "@/lib/cms/selectors";
import type { Site } from "@/lib/cms/types";
import { whatsappHref } from "@/lib/contact-links";
import { createRateLimiter } from "@/lib/rate-limit";
import { APPOINTMENT_FIELDS, HONEYPOT_FIELD, buildAppointmentFormConfig } from "./config";
import { formatPatientWhatsAppMessage } from "./message";
import { createAppointmentSchema } from "./schema";
import { getAppointmentService, toReferencePrefix } from "./service";
import type { AppointmentFormState, BookingContext, FieldErrors, FieldValues } from "./types";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

/**
 * Server Action (controller). Translates FormData ⇄ view-model, validates against the
 * current CMS form configuration and delegates the business work to the appointment service.
 */
export async function requestAppointment(
  _previous: AppointmentFormState,
  formData: FormData,
): Promise<AppointmentFormState> {
  const values = readFields(formData);

  // Bots fill every field. Pretend success so they don't retry.
  if (formData.get(HONEYPOT_FIELD)) {
    return { status: "success", referenceId: "REF-000000", delivered: true, whatsappUrl: null, patientName: "" };
  }

  const site = await getSite();
  const callUs = callUsHint(site);

  const requestHeaders = await headers();
  const clientIp = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous";
  if (!limiter.check(clientIp).allowed) {
    return { status: "error", message: `Too many requests from this device. ${callUs}`, values };
  }

  if (!site) {
    return { status: "error", message: "We can't take requests right now. Please try again in a few minutes.", values };
  }

  const parsed = createAppointmentSchema(buildAppointmentFormConfig(site)).safeParse(values);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please check the highlighted fields.",
      fieldErrors: toFieldErrors(parsed.error),
      values,
    };
  }

  const identity = site.documents["site.identity"];
  const contact = site.documents["site.contact"];
  const context: BookingContext = {
    clinicName: identity.name,
    clinicEmail: contact.email,
    referencePrefix: toReferencePrefix(identity.monogram),
    language: identity.language,
  };

  try {
    const { appointment, delivered } = await getAppointmentService().book(parsed.data, context);
    return {
      status: "success",
      referenceId: appointment.referenceId,
      delivered,
      patientName: appointment.name.split(" ")[0],
      whatsappUrl: contact.whatsapp
        ? whatsappHref(
            contact.whatsapp,
            formatPatientWhatsAppMessage(appointment, contact.whatsappMessage, identity.language),
          )
        : null,
    };
  } catch (error) {
    console.error("[appointments] booking failed", error);
    return { status: "error", message: `Something went wrong on our side. ${callUs}`, values };
  }
}

function callUsHint(site: Site | null): string {
  const phone = site && primaryPhone(site);
  return phone ? `Please call us on ${phone.display}.` : "Please try again later.";
}

function readFields(formData: FormData): FieldValues {
  return Object.fromEntries(
    APPOINTMENT_FIELDS.map((field) => {
      const value = formData.get(field);
      return [field, typeof value === "string" ? value : ""];
    }),
  );
}

function toFieldErrors(error: z.ZodError): FieldErrors {
  const fieldErrors: Partial<Record<string, string[]>> = z.flattenError(error).fieldErrors;
  const result: FieldErrors = {};
  for (const field of APPOINTMENT_FIELDS) {
    const message = fieldErrors[field]?.[0];
    if (message) result[field] = message;
  }
  return result;
}

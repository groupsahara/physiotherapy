import type { AppointmentField } from "./config";
import type { AppointmentRequest } from "./schema";

/** A validated request that has been accepted by the system. */
export interface Appointment extends AppointmentRequest {
  referenceId: string;
  createdAt: string;
}

/** Clinic details from the CMS that channels need at booking time. */
export interface BookingContext {
  /** Brand name for staff-facing summaries. */
  clinicName: string;
  /** Default inbox for the email channel. */
  clinicEmail: string;
  /** Prefix of reference ids (`[A-Z0-9]{0,6}`), e.g. "MC" → "MC-7K2Q9D". */
  referencePrefix: string;
  /** BCP 47 tag used to format dates in messages. */
  language: string;
}

/**
 * Primary channel: stores the request where the clinic works on it (the backend's
 * enquiries inbox) and issues its reference id.
 */
export interface AppointmentRepository {
  readonly channel: string;
  save(request: AppointmentRequest, context: BookingContext): Promise<{ referenceId: string }>;
}

/**
 * Output port: anything else that should hear about a new appointment
 * (email inbox, Slack/Sheets webhook, logs…). Strategy pattern —
 * the service depends on this interface, never on a concrete channel.
 */
export interface AppointmentNotifier {
  readonly channel: string;
  /** True when this channel actually reaches clinic staff (logs don't). */
  readonly reachesClinic: boolean;
  notify(appointment: Appointment, context: BookingContext): Promise<void>;
}

export interface BookingResult {
  appointment: Appointment;
  /** The repository or at least one staff-facing notifier accepted the request. */
  delivered: boolean;
}

export type FieldErrors = Partial<Record<AppointmentField, string>>;
export type FieldValues = Partial<Record<AppointmentField, string>>;

/** View-model returned by the server action to the form (must stay serialisable). */
export type AppointmentFormState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: FieldErrors; values?: FieldValues }
  | {
      status: "success";
      referenceId: string;
      delivered: boolean;
      /** Pre-filled WhatsApp message to the clinic; null when the CMS has no WhatsApp number. */
      whatsappUrl: string | null;
      patientName: string;
    };

export const initialAppointmentState: AppointmentFormState = { status: "idle" };

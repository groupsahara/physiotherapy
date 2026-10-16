import type { AppointmentField, AppointmentRequest } from "./schema";

/** A validated request that has been accepted by the system. */
export interface Appointment extends AppointmentRequest {
  referenceId: string;
  createdAt: string;
}

/**
 * Output port: anything that should hear about a new appointment
 * (email inbox, Slack/Sheets webhook, CRM, logs…). Strategy pattern —
 * the service depends on this interface, never on a concrete channel.
 */
export interface AppointmentNotifier {
  readonly channel: string;
  /** True when this channel actually reaches clinic staff (logs don't). */
  readonly reachesClinic: boolean;
  notify(appointment: Appointment): Promise<void>;
}

export interface BookingResult {
  appointment: Appointment;
  /** At least one staff-facing channel accepted the request. */
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
      whatsappUrl: string;
      patientName: string;
    };

export const initialAppointmentState: AppointmentFormState = { status: "idle" };

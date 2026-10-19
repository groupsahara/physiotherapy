"use client";

import { useEffect, useRef } from "react";
import { CircleCheck, Phone, RotateCcw } from "lucide-react";
import type { LinkAction } from "@/lib/cms/selectors";
import { buttonClasses } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import type { AppointmentFormState } from "../types";

type SuccessState = Extract<AppointmentFormState, { status: "success" }>;

interface BookingConfirmationProps {
  result: SuccessState;
  /** Shown when the request reached the clinic. */
  successMessage: string;
  /** Shown when it could not be stored: the patient should confirm on WhatsApp / by phone. */
  fallbackMessage: string;
  callAction: LinkAction | null;
  onBookAnother: () => void;
}

export function BookingConfirmation({
  result,
  successMessage,
  fallbackMessage,
  callAction,
  onBookAnother,
}: BookingConfirmationProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Move focus to the result so screen-reader and keyboard users land on it.
  useEffect(() => headingRef.current?.focus(), []);

  const { delivered, patientName, referenceId, whatsappUrl } = result;
  const message = delivered ? successMessage : fallbackMessage;

  return (
    <div className="flex flex-col items-center py-6 text-center" aria-live="polite">
      <span className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <CircleCheck aria-hidden className="size-9" />
      </span>

      <h3 ref={headingRef} tabIndex={-1} className="mt-5 font-display text-2xl font-bold outline-none">
        {delivered ? `Thank you${patientName ? `, ${patientName}` : ""}!` : `One last step${patientName ? `, ${patientName}` : ""}`}
      </h3>

      {message ? <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-muted">{message}</p> : null}

      <p className="mt-4 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-brand">
        Reference: {referenceId}
      </p>

      {(whatsappUrl || callAction) && (
        <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={buttonClasses({ variant: "whatsapp", size: "lg" })}>
              <WhatsAppIcon className="size-5" />
              Send on WhatsApp
            </a>
          )}
          {callAction && (
            <a href={callAction.href} className={buttonClasses({ variant: "outline", size: "lg" })}>
              <Phone aria-hidden className="size-5" />
              {callAction.label}
            </a>
          )}
        </div>
      )}

      <button type="button" onClick={onBookAnother} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand">
        <RotateCcw aria-hidden className="size-4" />
        Book another appointment
      </button>
    </div>
  );
}

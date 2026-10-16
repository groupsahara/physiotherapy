"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { CircleAlert, LoaderCircle, Send } from "lucide-react";
import { siteConfig } from "@/config/site";
import { addDaysISO } from "@/lib/date";
import { cn } from "@/lib/cn";
import { useTodayISO } from "@/hooks/use-today";
import { buttonClasses } from "@/components/ui/button";
import { requestAppointment } from "../actions";
import {
  MAX_BOOKING_DAYS_AHEAD,
  MESSAGE_MAX_LENGTH,
  appointmentServiceOptions,
  timeSlotOptions,
  visitTypeOptions,
} from "../constants";
import { onServicePrefill } from "../prefill";
import { initialAppointmentState } from "../types";
import { BookingConfirmation } from "./BookingConfirmation";
import { FormField, invalidProps } from "./FormField";

/**
 * Remounting the inner form (via `key`) is how "Book another" starts over:
 * it gives useActionState a fresh initial state without extra reset logic.
 */
export function AppointmentForm() {
  const [attempt, setAttempt] = useState(0);
  return <AppointmentFormInner key={attempt} onBookAnother={() => setAttempt((n) => n + 1)} />;
}

function AppointmentFormInner({ onBookAnother }: { onBookAnother: () => void }) {
  const [state, formAction, isPending] = useActionState(requestAppointment, initialAppointmentState);
  const serviceRef = useRef<HTMLSelectElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const today = useTodayISO(siteConfig.timeZone);

  // "Book this treatment" buttons elsewhere on the page pre-select the treatment.
  useEffect(
    () =>
      onServicePrefill((service) => {
        if (serviceRef.current) serviceRef.current.value = service;
        nameRef.current?.focus({ preventScroll: true });
      }),
    [],
  );

  if (state.status === "success") {
    return <BookingConfirmation result={state} onBookAnother={onBookAnother} />;
  }

  const errors = state.status === "error" ? (state.fieldErrors ?? {}) : {};
  const values = state.status === "error" ? (state.values ?? {}) : {};

  // With JS we dispatch inside a transition instead of letting React run the form action
  // natively: native form actions auto-reset every field afterwards, which would wipe the
  // patient's input on a validation error. `action` stays for no-JS progressive enhancement.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      {state.status === "error" && (
        <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-medium text-red-700 sm:col-span-2 dark:text-red-300">
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </div>
      )}

      <FormField id="appt-name" label="Full name" required error={errors.name}>
        <input
          ref={nameRef}
          id="appt-name"
          name="name"
          type="text"
          autoComplete="name"
          required
          minLength={2}
          maxLength={80}
          placeholder="Your name"
          defaultValue={values.name}
          className="field"
          {...invalidProps("appt-name", errors.name)}
        />
      </FormField>

      <FormField id="appt-phone" label="Mobile number" required error={errors.phone}>
        <input
          id="appt-phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="98765 43210"
          defaultValue={values.phone}
          className="field"
          {...invalidProps("appt-phone", errors.phone)}
        />
      </FormField>

      <FormField id="appt-service" label="Treatment needed" required error={errors.service} className="sm:col-span-2">
        <select
          ref={serviceRef}
          id="appt-service"
          name="service"
          required
          defaultValue={values.service ?? ""}
          className="field"
          {...invalidProps("appt-service", errors.service)}
        >
          <option value="" disabled>
            Select a treatment…
          </option>
          {appointmentServiceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <fieldset className="sm:col-span-2">
        <legend className="mb-1.5 text-sm font-semibold text-fg">
          Visit type <span aria-hidden className="text-red-500">*</span>
        </legend>
        <div className="grid grid-cols-2 gap-3">
          {visitTypeOptions.map((option, i) => (
            <label
              key={option.value}
              className="relative flex cursor-pointer flex-col rounded-xl border border-border bg-bg p-3.5 transition-colors has-checked:border-primary has-checked:bg-primary-soft has-focus-visible:outline-2 has-focus-visible:outline-brand"
            >
              <input
                type="radio"
                name="visitType"
                value={option.value}
                required
                defaultChecked={values.visitType ? values.visitType === option.value : i === 0}
                className="peer sr-only"
              />
              <span className="text-[15px] font-semibold">{option.label}</span>
              <span className="text-[13px] text-muted">{option.hint}</span>
              <span
                aria-hidden
                className="absolute top-3.5 right-3.5 size-4 rounded-full border-2 border-border peer-checked:border-[5px] peer-checked:border-primary"
              />
            </label>
          ))}
        </div>
        {errors.visitType && (
          <p className="mt-1.5 text-[13px] font-medium text-red-600 dark:text-red-400">{errors.visitType}</p>
        )}
      </fieldset>

      <FormField id="appt-date" label="Preferred date" error={errors.preferredDate}>
        <input
          id="appt-date"
          name="preferredDate"
          type="date"
          min={today}
          max={today ? addDaysISO(today, MAX_BOOKING_DAYS_AHEAD) : undefined}
          defaultValue={values.preferredDate}
          className="field"
          {...invalidProps("appt-date", errors.preferredDate)}
        />
      </FormField>

      <FormField id="appt-slot" label="Preferred time" error={errors.preferredSlot}>
        <select id="appt-slot" name="preferredSlot" defaultValue={values.preferredSlot ?? "any"} className="field">
          {timeSlotOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="appt-message" label="Tell us about your pain" error={errors.message} className="sm:col-span-2">
        <textarea
          id="appt-message"
          name="message"
          rows={3}
          maxLength={MESSAGE_MAX_LENGTH}
          placeholder="e.g. Lower back pain for 3 weeks, worse after sitting"
          defaultValue={values.message}
          className="field"
          {...invalidProps("appt-message", errors.message)}
        />
      </FormField>

      {/* Honeypot — invisible to people, irresistible to bots. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="appt-company">Company</label>
        <input id="appt-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3 sm:col-span-2">
        <button type="submit" disabled={isPending} className={cn(buttonClasses({ size: "lg" }), "w-full")}>
          {isPending ? (
            <>
              <LoaderCircle aria-hidden className="size-5 animate-spin" />
              Sending request…
            </>
          ) : (
            <>
              <Send aria-hidden className="size-5" />
              Request Appointment
            </>
          )}
        </button>
        <p className="text-center text-[13px] text-muted">
          We&apos;ll call you to confirm your slot. Consultation is chargeable.
        </p>
      </div>
    </form>
  );
}

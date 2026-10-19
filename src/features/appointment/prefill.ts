/**
 * Tiny event channel that lets any "Book this treatment" button pre-select
 * the treatment in the appointment form without the two components knowing
 * about each other (or sharing a React tree / context).
 */

const PREFILL_EVENT = "appointment:prefill";

interface PrefillDetail {
  /** Treatment slug. */
  treatment: string;
}

export function requestTreatmentPrefill(treatment: string) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail: { treatment } }));
}

export function onTreatmentPrefill(handler: (treatment: string) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<PrefillDetail>).detail.treatment);
  window.addEventListener(PREFILL_EVENT, listener);
  return () => window.removeEventListener(PREFILL_EVENT, listener);
}

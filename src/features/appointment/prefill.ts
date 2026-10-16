/**
 * Tiny event channel that lets any "Book this treatment" button pre-select
 * the treatment in the appointment form without the two components knowing
 * about each other (or sharing a React tree / context).
 */

const PREFILL_EVENT = "moving-cure:appointment-prefill";

interface PrefillDetail {
  service: string;
}

export function requestServicePrefill(service: string) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail: { service } }));
}

export function onServicePrefill(handler: (service: string) => void) {
  const listener = (event: Event) => handler((event as CustomEvent<PrefillDetail>).detail.service);
  window.addEventListener(PREFILL_EVENT, listener);
  return () => window.removeEventListener(PREFILL_EVENT, listener);
}

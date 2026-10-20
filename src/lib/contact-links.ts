import type { PhoneNumber, PostalAddress } from "@/lib/cms/types";

/**
 * Pure builders for every outbound contact link. Components never
 * hand-assemble `tel:`/`mailto:`/WhatsApp/Maps URLs — they call these.
 */

/** Joins the non-empty parts. */
export const joinParts = (parts: readonly string[], separator: string) => parts.filter(Boolean).join(separator);

export const telHref = (phone: PhoneNumber) => `tel:${phone.e164}`;

export function mailtoHref(email: string, subject?: string) {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

export function whatsappHref(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatAddress(address: PostalAddress): string {
  return joinParts(
    [address.street, address.landmark, address.locality, joinParts([address.city, address.postalCode], " - ")],
    ", ",
  );
}

/** Address lines for multi-line display (cards, footer). Empty lines are skipped. */
export function addressLines(address: PostalAddress): string[] {
  return [
    address.street,
    joinParts([address.landmark, address.locality], ", "),
    joinParts([address.city, address.postalCode], " - "),
  ].filter(Boolean);
}

/** Business name + address, so Google resolves the clinic's own listing (address is the fallback). */
function mapsQuery(placeName: string, address: PostalAddress) {
  return encodeURIComponent(joinParts([placeName, formatAddress(address)], ", "));
}

export function mapsDirectionsHref(placeName: string, address: PostalAddress) {
  return `https://www.google.com/maps/search/?api=1&query=${mapsQuery(placeName, address)}`;
}

/** Browser key for the Maps Embed API (env `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`); it ends up in the page HTML. */
const mapsApiKey = (process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "").trim();

/** Maps Embed API URL when a key is configured, otherwise the key-less embed. */
export function mapsEmbedSrc(placeName: string, address: PostalAddress) {
  if (mapsApiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(mapsApiKey)}&q=${mapsQuery(placeName, address)}&zoom=16`;
  }
  return `https://maps.google.com/maps?q=${mapsQuery(placeName, address)}&z=16&output=embed`;
}

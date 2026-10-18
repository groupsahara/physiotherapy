import type { PhoneNumber, PostalAddress } from "@/types/site";

/**
 * Pure builders for every outbound contact link. Components never
 * hand-assemble `tel:`/`mailto:`/WhatsApp/Maps URLs — they call these.
 */

export const telHref = (phone: PhoneNumber) => `tel:${phone.e164}`;

export function mailtoHref(email: string, subject?: string) {
  return subject ? `mailto:${email}?subject=${encodeURIComponent(subject)}` : `mailto:${email}`;
}

export function whatsappHref(number: string, message?: string) {
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function formatAddress(address: PostalAddress): string {
  return `${address.street}, ${address.landmark}, ${address.locality}, ${address.city} - ${address.postalCode}`;
}

/** Address lines for multi-line display (cards, footer). */
export function addressLines(address: PostalAddress): string[] {
  return [
    address.street,
    `${address.landmark}, ${address.locality}`,
    `${address.city} - ${address.postalCode}`,
  ];
}

/** Business name + address, so Google resolves the clinic's own listing (address is the fallback). */
function mapsQuery(placeName: string, address: PostalAddress) {
  return encodeURIComponent(`${placeName}, ${formatAddress(address)}`);
}

export function mapsDirectionsHref(placeName: string, address: PostalAddress) {
  return `https://www.google.com/maps/search/?api=1&query=${mapsQuery(placeName, address)}`;
}

/** Key-less Google Maps embed URL. */
export function mapsEmbedSrc(placeName: string, address: PostalAddress) {
  return `https://maps.google.com/maps?q=${mapsQuery(placeName, address)}&z=16&output=embed`;
}

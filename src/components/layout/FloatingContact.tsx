import { Phone } from "lucide-react";
import { primaryPhone } from "@/lib/cms/selectors";
import type { Site } from "@/lib/cms/types";
import { telHref, whatsappHref } from "@/lib/contact-links";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/** Always-reachable quick actions — most patients contact a clinic from their phone. */
export function FloatingContact({ site }: { site: Site }) {
  const { whatsapp, whatsappMessage } = site.documents["site.contact"];
  const showWhatsApp = site.documents["site.layout"].floatingWhatsApp && whatsapp !== "";
  const phone = primaryPhone(site);

  if (!showWhatsApp && !phone) return null;

  return (
    <div className="fixed right-4 bottom-4 z-40 flex flex-col gap-3 sm:right-6 sm:bottom-6">
      {showWhatsApp && (
        <a
          href={whatsappHref(whatsapp, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="group relative inline-flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift transition-transform hover:scale-105"
        >
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-25" />
          <WhatsAppIcon className="relative size-7" />
        </a>
      )}
      {phone && (
        <a
          href={telHref(phone)}
          aria-label={`Call ${phone.display}`}
          className="inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-lift transition-transform hover:scale-105 sm:hidden"
        >
          <Phone aria-hidden className="size-6" />
        </a>
      )}
    </div>
  );
}

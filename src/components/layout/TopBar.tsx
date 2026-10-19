import { House, Mail, MapPin, Phone } from "lucide-react";
import type { Site } from "@/lib/cms/types";
import { joinParts, mailtoHref, telHref } from "@/lib/contact-links";
import { Container } from "@/components/ui/Container";

/** Slim contact strip above the header (desktop / tablet). */
export function TopBar({ site }: { site: Site }) {
  const { phones, email, address } = site.documents["site.contact"];
  const { topBarNotice } = site.documents["site.layout"];
  const place = joinParts([joinParts([address.locality, address.city], ", "), address.postalCode], " - ");

  return (
    <div className="hidden bg-footer text-[13px] text-blue-100 md:block">
      <Container className="flex h-10 items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          {place ? (
            <span className="flex items-center gap-1.5">
              <MapPin aria-hidden className="size-3.5 text-blue-300" />
              {place}
            </span>
          ) : null}
          {email ? (
            <a href={mailtoHref(email)} className="hidden items-center gap-1.5 hover:text-white lg:flex">
              <Mail aria-hidden className="size-3.5 text-blue-300" />
              {email}
            </a>
          ) : null}
        </div>
        <div className="flex items-center gap-5">
          {topBarNotice ? (
            <span className="flex items-center gap-1.5 font-medium text-white">
              <House aria-hidden className="size-3.5 text-blue-300" />
              {topBarNotice}
            </span>
          ) : null}
          {topBarNotice && phones.length > 0 ? <span aria-hidden className="h-4 w-px bg-white/20" /> : null}
          {phones.length > 0 ? (
            <span className="flex items-center gap-3">
              <Phone aria-hidden className="size-3.5 text-blue-300" />
              {phones.map((phone, i) => (
                <span key={phone.e164} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="text-white/30">/</span>}
                  <a href={telHref(phone)} className="hover:text-white">
                    {phone.display}
                  </a>
                </span>
              ))}
            </span>
          ) : null}
        </div>
      </Container>
    </div>
  );
}

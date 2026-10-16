import { House, Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/config/site";
import { mailtoHref, telHref } from "@/lib/contact-links";
import { Container } from "@/components/ui/Container";

/** Slim contact strip above the header (desktop / tablet). */
export function TopBar() {
  const { phones, email, address } = siteConfig.contact;

  return (
    <div className="hidden bg-footer text-[13px] text-blue-100 md:block">
      <Container className="flex h-10 items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5 text-blue-300" />
            {address.locality}, {address.city} - {address.postalCode}
          </span>
          <a href={mailtoHref(email)} className="hidden items-center gap-1.5 hover:text-white lg:flex">
            <Mail aria-hidden className="size-3.5 text-blue-300" />
            {email}
          </a>
        </div>
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5 font-medium text-white">
            <House aria-hidden className="size-3.5 text-blue-300" />
            Home visit available on call
          </span>
          <span aria-hidden className="h-4 w-px bg-white/20" />
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
        </div>
      </Container>
    </div>
  );
}

import type { ReactNode } from "react";
import { House, Mail, MapPin, Phone } from "lucide-react";
import { mainNav, sectionHref } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { services } from "@/content/services";
import { addressLines, mailtoHref, mapsDirectionsHref, telHref } from "@/lib/contact-links";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { CurrentYear } from "./CurrentYear";

export function SiteFooter() {
  const { phones, email, address, mapsPlaceName } = siteConfig.contact;

  return (
    <footer className="relative overflow-hidden bg-footer text-blue-100/80">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo inverted />
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed">
            {siteConfig.legalName}. Treatment by a specialized, well-experienced and registered
            physiotherapist — {siteConfig.practitioner.name}, {siteConfig.practitioner.qualifications.join(", ")}.
          </p>
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white">
            <House aria-hidden className="size-4 text-blue-300" />
            Home visit available on call
          </p>
        </div>

        <FooterColumn title="Explore" className="lg:col-span-2">
          {mainNav.map((item) => (
            <li key={item.id}>
              <a href={sectionHref(item.id)} className="transition-colors hover:text-white">
                {item.label}
              </a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Treatments" className="lg:col-span-3">
          {services.map((service) => (
            <li key={service.slug}>
              <a href={sectionHref("services")} className="transition-colors hover:text-white">
                {service.title}
              </a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact" className="lg:col-span-3">
          <li>
            <a href={mapsDirectionsHref(mapsPlaceName, address)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-white">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-blue-300" />
              <address className="not-italic">
                {addressLines(address).map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
            </a>
          </li>
          {phones.map((phone) => (
            <li key={phone.e164}>
              <a href={telHref(phone)} className="flex items-center gap-3 hover:text-white">
                <Phone aria-hidden className="size-4 shrink-0 text-blue-300" />
                {phone.display}
              </a>
            </li>
          ))}
          <li>
            <a href={mailtoHref(email)} className="flex items-center gap-3 break-all hover:text-white">
              <Mail aria-hidden className="size-4 shrink-0 text-blue-300" />
              {email}
            </a>
          </li>
        </FooterColumn>
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.legalName}. All rights reserved.
          </p>
          <p className="text-blue-100/60">Consultation chargeable · Appointments by phone or online</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      <h3 className="font-display text-sm font-bold tracking-[0.14em] text-white uppercase">{title}</h3>
      <ul className="mt-5 space-y-3 text-[15px]">{children}</ul>
    </div>
  );
}

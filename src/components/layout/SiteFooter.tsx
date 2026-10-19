import type { ReactNode } from "react";
import { House, Mail, MapPin, Phone } from "lucide-react";
import { isSectionVisible, visibleNavigation } from "@/lib/cms/selectors";
import type { Site } from "@/lib/cms/types";
import { addressLines, mailtoHref, mapsDirectionsHref, telHref } from "@/lib/contact-links";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { CurrentYear } from "./CurrentYear";

export function SiteFooter({ site }: { site: Site }) {
  const identity = site.documents["site.identity"];
  const footer = site.documents["section.footer"];
  const { phones, email, address, mapsPlaceName } = site.documents["site.contact"];
  const navigation = visibleNavigation(site);
  const treatments = isSectionVisible(site, "services") ? site.collections.treatments : [];
  const lines = addressLines(address);
  const hasContact = lines.length > 0 || phones.length > 0 || email !== "";

  return (
    <footer className="relative overflow-hidden bg-footer text-blue-100/80">
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <Container className="relative grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo identity={identity} inverted />
          {footer.blurb ? <p className="mt-5 max-w-sm text-[15px] leading-relaxed">{footer.blurb}</p> : null}
          {footer.badge ? (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white">
              <House aria-hidden className="size-4 text-blue-300" />
              {footer.badge}
            </p>
          ) : null}
        </div>

        {navigation.length > 0 && (
          <FooterColumn title={footer.exploreTitle} className="lg:col-span-2">
            {navigation.map((item) => (
              <li key={item.target}>
                <a href={`#${item.target}`} className="transition-colors hover:text-white">
                  {item.label}
                </a>
              </li>
            ))}
          </FooterColumn>
        )}

        {treatments.length > 0 && (
          <FooterColumn title={footer.treatmentsTitle} className="lg:col-span-3">
            {treatments.map((treatment) => (
              <li key={treatment.id}>
                <a href="#services" className="transition-colors hover:text-white">
                  {treatment.title}
                </a>
              </li>
            ))}
          </FooterColumn>
        )}

        {hasContact && (
          <FooterColumn title={footer.contactTitle} className="lg:col-span-3">
            {lines.length > 0 && (
              <li>
                <a href={mapsDirectionsHref(mapsPlaceName, address)} target="_blank" rel="noopener noreferrer" className="flex gap-3 hover:text-white">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-blue-300" />
                  <address className="not-italic">
                    {lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </a>
              </li>
            )}
            {phones.map((phone) => (
              <li key={phone.e164}>
                <a href={telHref(phone)} className="flex items-center gap-3 hover:text-white">
                  <Phone aria-hidden className="size-4 shrink-0 text-blue-300" />
                  {phone.display}
                </a>
              </li>
            ))}
            {email && (
              <li>
                <a href={mailtoHref(email)} className="flex items-center gap-3 break-all hover:text-white">
                  <Mail aria-hidden className="size-4 shrink-0 text-blue-300" />
                  {email}
                </a>
              </li>
            )}
          </FooterColumn>
        )}
      </Container>

      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-[13px] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {identity.legalName || identity.name}. All rights reserved.
          </p>
          {footer.bottomNote ? <p className="text-blue-100/60">{footer.bottomNote}</p> : null}
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={className}>
      {title ? <h3 className="font-display text-sm font-bold tracking-[0.14em] text-white uppercase">{title}</h3> : null}
      <ul className={title ? "mt-5 space-y-3 text-[15px]" : "space-y-3 text-[15px]"}>{children}</ul>
    </div>
  );
}

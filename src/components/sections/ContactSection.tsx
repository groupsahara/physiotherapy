import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, House, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { callAction } from "@/lib/cms/selectors";
import type { Site } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { addressLines, joinParts, mailtoHref, mapsDirectionsHref, mapsEmbedSrc, telHref } from "@/lib/contact-links";
import { buildAppointmentFormConfig } from "@/features/appointment/config";
import { AppointmentForm } from "@/features/appointment/components/AppointmentForm";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

interface ContactCardContent {
  key: string;
  icon: LucideIcon;
  title: string;
  body: ReactNode;
}

export function ContactSection({ site }: { site: Site }) {
  const content = site.documents["section.contact"];
  const identity = site.documents["site.identity"];
  const { phones, email, address, mapsPlaceName } = site.documents["site.contact"];
  const lines = addressLines(address);
  const cards: ContactCardContent[] = [];

  if (lines.length > 0) {
    cards.push({
      key: "visit",
      icon: MapPin,
      title: content.visitTitle,
      body: (
        <>
          <address className="not-italic">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
          {content.directionsLabel ? (
            <a
              href={mapsDirectionsHref(mapsPlaceName, address)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
            >
              {content.directionsLabel} <ArrowUpRight aria-hidden className="size-4" />
            </a>
          ) : null}
        </>
      ),
    });
  }

  if (phones.length > 0) {
    cards.push({
      key: "call",
      icon: Phone,
      title: content.callTitle,
      body: phones.map((phone) => (
        <a key={phone.e164} href={telHref(phone)} className="block font-semibold text-fg hover:text-brand">
          {phone.display}
        </a>
      )),
    });
  }

  if (email) {
    cards.push({
      key: "email",
      icon: Mail,
      title: content.emailTitle,
      body: (
        <a href={mailtoHref(email, content.emailSubject)} className="font-semibold break-all text-fg hover:text-brand">
          {email}
        </a>
      ),
    });
  }

  if (content.homeVisitTitle || content.homeVisitText) {
    cards.push({ key: "home-visit", icon: House, title: content.homeVisitTitle, body: content.homeVisitText });
  }

  const showMap = content.showMap && (lines.length > 0 || mapsPlaceName !== "");

  return (
    <Section id="contact" labelledBy="contact-title">
      <SectionHeading
        id="contact-title"
        eyebrow={content.eyebrow}
        title={content.title}
        description={content.description}
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <ul className="grid content-start gap-4">
          {cards.map((card, i) => (
            <ContactCard key={card.key} icon={card.icon} title={card.title} delay={i * 80}>
              {card.body}
            </ContactCard>
          ))}
        </ul>

        <Reveal delay={120} className="card p-6 sm:p-8">
          {content.formTitle ? (
            <h3 className={cn("font-display text-xl font-bold", !content.formSubtitle && "mb-6")}>{content.formTitle}</h3>
          ) : null}
          {content.formSubtitle ? <p className="mt-1 mb-6 text-[15px] text-muted">{content.formSubtitle}</p> : null}
          <AppointmentForm config={buildAppointmentFormConfig(site)} callAction={callAction(site)} />
        </Reveal>
      </div>

      {showMap && (
        <Reveal className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface-2 shadow-card">
          <iframe
            title={`Map showing ${joinParts([identity.name, address.locality], ", ")}`}
            src={mapsEmbedSrc(mapsPlaceName, address)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="block h-85 w-full border-0 dark:[filter:invert(0.9)_hue-rotate(180deg)_saturate(0.8)]"
          />
        </Reveal>
      )}
    </Section>
  );
}

function ContactCard({
  icon: Icon,
  title,
  delay,
  children,
}: {
  icon: LucideIcon;
  title: string;
  delay: number;
  children: ReactNode;
}) {
  return (
    <Reveal as="li" delay={delay} className="card flex gap-4 p-5 sm:p-6">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-brand">
        <Icon aria-hidden className="size-6" />
      </span>
      <div className="text-[15px] leading-relaxed text-muted">
        {title ? <h3 className="mb-1 font-display text-base font-bold text-fg">{title}</h3> : null}
        {children}
      </div>
    </Reveal>
  );
}

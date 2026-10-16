import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, House, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { addressLines, mailtoHref, mapsDirectionsHref, mapsEmbedSrc, telHref } from "@/lib/contact-links";
import { AppointmentForm } from "@/features/appointment/components/AppointmentForm";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function ContactSection() {
  const { phones, email, address } = siteConfig.contact;

  return (
    <Section id="contact" labelledBy="contact-title">
      <SectionHeading
        id="contact-title"
        eyebrow="Book an appointment"
        title="Start your recovery today"
        description="Send a request and we'll call you back to confirm — or reach us directly by phone, WhatsApp or email."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <ul className="grid content-start gap-4">
          <ContactCard icon={MapPin} title="Visit the clinic" delay={0}>
            <address className="not-italic">
              {addressLines(address).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <a
              href={mapsDirectionsHref(address)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
            >
              Get directions <ArrowUpRight aria-hidden className="size-4" />
            </a>
          </ContactCard>

          <ContactCard icon={Phone} title="Call us" delay={80}>
            {phones.map((phone) => (
              <a key={phone.e164} href={telHref(phone)} className="block font-semibold text-fg hover:text-brand">
                {phone.display}
              </a>
            ))}
          </ContactCard>

          <ContactCard icon={Mail} title="Email" delay={160}>
            <a href={mailtoHref(email, "Appointment enquiry")} className="font-semibold break-all text-fg hover:text-brand">
              {email}
            </a>
          </ContactCard>

          <ContactCard icon={House} title="Home visits" delay={240}>
            Available on call — ring either number to schedule a visit at your home.
          </ContactCard>
        </ul>

        <Reveal delay={120} className="card p-6 sm:p-8">
          <h3 className="font-display text-xl font-bold">Request an appointment</h3>
          <p className="mt-1 mb-6 text-[15px] text-muted">Takes less than a minute.</p>
          <AppointmentForm />
        </Reveal>
      </div>

      <Reveal className="mt-8 overflow-hidden rounded-3xl border border-border bg-surface-2 shadow-card">
        <iframe
          title={`Map showing ${siteConfig.name} clinic, ${address.locality}`}
          src={mapsEmbedSrc(address)}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block h-85 w-full border-0 dark:[filter:invert(0.9)_hue-rotate(180deg)_saturate(0.8)]"
        />
      </Reveal>
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
        <h3 className="mb-1 font-display text-base font-bold text-fg">{title}</h3>
        {children}
      </div>
    </Reveal>
  );
}

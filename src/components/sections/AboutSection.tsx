import Image from "next/image";
import { GraduationCap } from "lucide-react";
import { siteConfig } from "@/config/site";
import { aboutPhoto } from "@/content/media";
import { reasons } from "@/content/features";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function AboutSection() {
  const { practitioner, legalName } = siteConfig;

  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal className="relative order-2 lg:order-1">
          <div className="relative aspect-4/3 overflow-hidden rounded-4xl shadow-lift lg:aspect-4/5">
            <Image
              src={aboutPhoto.src}
              alt={aboutPhoto.alt}
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-8 left-6 right-6 rounded-2xl border border-border bg-surface p-5 shadow-lift sm:left-auto sm:-right-6 sm:w-80">
            <div className="flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-fg">
                <GraduationCap aria-hidden className="size-6" />
              </span>
              <div>
                <p className="font-display text-lg font-bold">{practitioner.name}</p>
                <p className="text-sm font-semibold text-brand">{practitioner.qualifications.join(" · ")}</p>
                <p className="mt-1 text-[13px] leading-snug text-muted">Registered Physiotherapist</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="order-1 lg:order-2">
          <Reveal>
            <p className="eyebrow">About the clinic</p>
            <h2 id="about-title" className="mt-3 font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Treatment by a specialized, well-experienced &amp; registered physiotherapist
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted text-pretty">
              {legalName} is led by {practitioner.name}, {practitioner.qualifications[0]} — a Bachelor of
              Physiotherapy from the University of Delhi — and {practitioner.qualifications[1]}. Every
              treatment starts with understanding the root cause of your pain, not just the symptoms.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted text-pretty">
              From everyday back and neck pain to recovery after a stroke or surgery, we combine hands-on
              therapy, modern modalities and guided exercise to get you moving — and keep you moving.
            </p>
          </Reveal>

          <ul className="mt-9 grid gap-4">
            {reasons.map(({ title, description, icon: Icon }, i) => (
              <Reveal
                as="li"
                key={title}
                delay={i * 90}
                className="flex gap-4 rounded-2xl border border-border bg-bg-subtle p-4 transition-colors hover:border-brand/40"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-surface text-brand shadow-card">
                  <Icon aria-hidden className="size-5" />
                </span>
                <span>
                  <span className="block font-display font-bold">{title}</span>
                  <span className="text-[15px] text-muted">{description}</span>
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

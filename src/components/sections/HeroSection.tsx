import Image from "next/image";
import { BadgeCheck, CalendarCheck, CircleCheck, House, Phone } from "lucide-react";
import { sectionHref } from "@/config/navigation";
import { primaryPhone, siteConfig } from "@/config/site";
import { heroPhoto } from "@/content/media";
import { telHref } from "@/lib/contact-links";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/button";

const promises = ["One-on-one sessions", "Orthopedic & neuro rehab", "Home visits on call"];

export function HeroSection() {
  const { practitioner } = siteConfig;

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
        <div className="absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-(--hero-glow) blur-3xl" />
        <div className="absolute top-1/4 -left-48 size-104 rounded-full bg-(--hero-glow) blur-3xl" />
      </div>

      <Container className="relative grid items-center gap-14 pt-10 pb-20 sm:pt-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pt-20 lg:pb-28">
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[13px] font-semibold text-muted shadow-card">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
              <span className="relative size-2 rounded-full bg-emerald-500" />
            </span>
            Physiotherapy Clinic &amp; Rehabilitation Centre · {siteConfig.contact.address.locality}, Delhi
          </p>

          <h1
            id="hero-title"
            className="mt-6 font-display text-[2.6rem] leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-[4.1rem]"
          >
            Move freely.{" "}
            <span className="relative whitespace-nowrap text-brand">
              Live pain-free.
              <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-3 w-full text-brand/35">
                <path d="M2 9c60-6 140-8 296-4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty sm:text-xl">
            Expert physiotherapy by <strong className="font-semibold text-fg">{practitioner.name}</strong>,{" "}
            {practitioner.qualifications.join(", ")} — personalised, hands-on treatment for pain relief and
            rehabilitation, at our clinic or in the comfort of your home.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href={sectionHref("contact")} className={buttonClasses({ size: "lg" })}>
              <CalendarCheck aria-hidden className="size-5" />
              Book an Appointment
            </a>
            <a href={telHref(primaryPhone)} className={buttonClasses({ variant: "outline", size: "lg" })}>
              <Phone aria-hidden className="size-5" />
              Call {primaryPhone.display}
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
            {promises.map((item) => (
              <li key={item} className="flex items-center gap-2 text-[15px] font-medium text-fg">
                <CircleCheck aria-hidden className="size-5 text-brand" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150} className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <div aria-hidden className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-primary/25 to-primary/0 sm:-inset-5" />
          <div className="relative aspect-4/5 overflow-hidden rounded-4xl border border-border shadow-lift sm:aspect-square lg:aspect-[4/4.6]">
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              fill
              preload
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, (min-width: 640px) 576px, 100vw"
              className="object-cover object-[60%_center]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#061733]/45 via-transparent to-transparent" />
          </div>

          {/* Floating credential cards */}
          <div className="animate-float absolute -left-3 top-8 flex items-center gap-3 rounded-2xl border border-border bg-surface/95 p-3.5 pr-5 shadow-lift backdrop-blur sm:-left-8">
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-brand">
              <BadgeCheck aria-hidden className="size-6" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold">{practitioner.name}</span>
              <span className="text-[13px] text-muted">{practitioner.qualifications.join(" · ")}</span>
            </span>
          </div>

          <div className="animate-float absolute -right-2 bottom-8 flex items-center gap-3 rounded-2xl bg-primary p-3.5 pr-5 text-primary-fg shadow-lift [animation-delay:-3s] sm:-right-6">
            <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
              <House aria-hidden className="size-6" />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-[15px] font-bold">Home Visit</span>
              <span className="text-[13px] text-blue-100">Available on call</span>
            </span>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

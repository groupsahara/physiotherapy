import { BadgeCheck, CalendarCheck, CircleCheck, House, Phone } from "lucide-react";
import { bookAction, callAction } from "@/lib/cms/selectors";
import type { Site } from "@/lib/cms/types";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { ContentImage } from "@/components/ui/ContentImage";
import { InlineMarkup } from "@/components/ui/InlineMarkup";
import { Reveal } from "@/components/ui/Reveal";
import { buttonClasses } from "@/components/ui/button";

export function HeroSection({ site }: { site: Site }) {
  const hero = site.documents["section.hero"];
  const practitioner = site.documents["site.practitioner"];
  const book = bookAction(site, hero.primaryCtaLabel);
  const call = callAction(site);
  const showPractitionerCard = hero.showPractitionerCard && practitioner.name !== "";
  const showVisitCard = hero.cardTitle !== "" || hero.cardSubtitle !== "";

  return (
    <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden">
      {/* Backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_right,black_20%,transparent_70%)]" />
        <div className="absolute -top-40 right-[-10%] size-[42rem] rounded-full bg-(--hero-glow) blur-3xl" />
        <div className="absolute top-1/4 -left-48 size-104 rounded-full bg-(--hero-glow) blur-3xl" />
      </div>

      <Container
        className={cn(
          "relative grid items-center gap-14 pt-10 pb-20 sm:pt-14 lg:gap-10 lg:pt-20 lg:pb-28",
          hero.image && "lg:grid-cols-[1.05fr_1fr]",
        )}
      >
        <Reveal>
          {hero.badge ? (
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-[13px] font-semibold text-muted shadow-card">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500 opacity-60" />
                <span className="relative size-2 rounded-full bg-emerald-500" />
              </span>
              {hero.badge}
            </p>
          ) : null}

          <h1
            id="hero-title"
            className="mt-6 font-display text-[2.6rem] leading-[1.08] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-[4.1rem]"
          >
            {hero.titleLead}
            {hero.titleLead && hero.titleHighlight ? " " : null}
            {hero.titleHighlight ? (
              <span className="relative whitespace-nowrap text-brand">
                {hero.titleHighlight}
                <svg aria-hidden viewBox="0 0 300 12" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-3 w-full text-brand/35">
                  <path d="M2 9c60-6 140-8 296-4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            ) : null}
          </h1>

          {hero.intro ? (
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty sm:text-xl">
              <InlineMarkup text={hero.intro} strongClassName="font-semibold text-fg" />
            </p>
          ) : null}

          {(book || call) && (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              {book && (
                <a href={book.href} className={buttonClasses({ size: "lg" })}>
                  <CalendarCheck aria-hidden className="size-5" />
                  {book.label}
                </a>
              )}
              {call && (
                <a href={call.href} className={buttonClasses({ variant: "outline", size: "lg" })}>
                  <Phone aria-hidden className="size-5" />
                  {call.label}
                </a>
              )}
            </div>
          )}

          {hero.promises.length > 0 && (
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3">
              {hero.promises.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[15px] font-medium text-fg">
                  <CircleCheck aria-hidden className="size-5 text-brand" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </Reveal>

        {hero.image && (
          <Reveal delay={150} className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div aria-hidden className="absolute -inset-4 rotate-3 rounded-[2.5rem] bg-gradient-to-br from-primary/25 to-primary/0 sm:-inset-5" />
            <div className="relative aspect-4/5 overflow-hidden rounded-4xl border border-border bg-surface-2 shadow-lift sm:aspect-square lg:aspect-[4/4.6]">
              <ContentImage
                image={hero.image}
                fill
                preload
                sizes="(min-width: 1024px) 45vw, (min-width: 640px) 576px, 100vw"
                className="object-cover object-[60%_center]"
              />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#061733]/45 via-transparent to-transparent" />
            </div>

            {/* Floating credential cards */}
            {showPractitionerCard && (
              <div className="animate-float absolute -left-3 top-8 flex items-center gap-3 rounded-2xl border border-border bg-surface/95 p-3.5 pr-5 shadow-lift backdrop-blur sm:-left-8">
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-brand">
                  <BadgeCheck aria-hidden className="size-6" />
                </span>
                <span className="leading-tight">
                  <span className="block font-display text-[15px] font-bold">{practitioner.name}</span>
                  {practitioner.qualifications.length > 0 && (
                    <span className="text-[13px] text-muted">{practitioner.qualifications.join(" · ")}</span>
                  )}
                </span>
              </div>
            )}

            {showVisitCard && (
              <div className="animate-float absolute -right-2 bottom-8 flex items-center gap-3 rounded-2xl bg-primary p-3.5 pr-5 text-primary-fg shadow-lift [animation-delay:-3s] sm:-right-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
                  <House aria-hidden className="size-6" />
                </span>
                <span className="leading-tight">
                  {hero.cardTitle ? <span className="block font-display text-[15px] font-bold">{hero.cardTitle}</span> : null}
                  {hero.cardSubtitle ? <span className="text-[13px] text-blue-100">{hero.cardSubtitle}</span> : null}
                </span>
              </div>
            )}
          </Reveal>
        )}
      </Container>
    </section>
  );
}

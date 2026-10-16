import { Quote, Star } from "lucide-react";
import { testimonials } from "@/content/testimonials";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function TestimonialsSection() {
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials" labelledBy="testimonials-title">
      <SectionHeading
        id="testimonials-title"
        eyebrow="Patient stories"
        title="Back to the things they love"
        description="What patients say about recovering with Moving Cure."
      />

      <ul className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial, i) => (
          <Reveal
            as="li"
            key={testimonial.name}
            delay={i * 100}
            className="card relative flex flex-col p-7 transition-shadow duration-300 hover:shadow-lift"
          >
            <Quote aria-hidden className="absolute top-6 right-6 size-10 text-primary/10" />
            <div className="flex gap-0.5" role="img" aria-label={`Rated ${testimonial.rating} out of 5`}>
              {Array.from({ length: 5 }, (_, star) => (
                <Star
                  key={star}
                  aria-hidden
                  className={star < testimonial.rating ? "size-4.5 fill-star text-star" : "size-4.5 text-border"}
                />
              ))}
            </div>
            <blockquote className="mt-5 flex-1 text-[15.5px] leading-relaxed text-fg">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <footer className="mt-6 flex items-center gap-3 border-t border-border pt-5">
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-full bg-primary-soft font-display font-bold text-brand"
              >
                {testimonial.name.charAt(0)}
              </span>
              <span>
                <span className="block font-display font-bold">{testimonial.name}</span>
                <span className="text-sm text-muted">{testimonial.context}</span>
              </span>
            </footer>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">Error 404</p>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-lg text-muted">
        The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you moving in the right direction.
      </p>
      <Link href="/" className={buttonClasses({ size: "lg", className: "mt-8" })}>
        Back to home
        <ArrowRight aria-hidden className="size-5" />
      </Link>
    </Container>
  );
}

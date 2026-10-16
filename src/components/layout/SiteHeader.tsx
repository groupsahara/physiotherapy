"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Menu, Phone, X } from "lucide-react";
import { mainNav, sectionHref } from "@/config/navigation";
import { primaryPhone, siteConfig } from "@/config/site";
import { telHref } from "@/lib/contact-links";
import { cn } from "@/lib/cn";
import { useScrolled } from "@/hooks/use-scrolled";
import { useScrollSpy } from "@/hooks/use-scroll-spy";
import { ThemeToggle } from "@/features/theme/ThemeToggle";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { buttonClasses } from "@/components/ui/button";

// "home" is observed (but not rendered as a link) so no item is highlighted over the hero.
const sectionIds = ["home", ...mainNav.map((item) => item.id)];

export function SiteHeader() {
  const scrolled = useScrolled();
  const activeId = useScrollSpy(sectionIds);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    const closeOnDesktop = () => window.innerWidth >= 1024 && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", closeOnDesktop);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", closeOnDesktop);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300",
        scrolled || menuOpen
          ? "border-border bg-bg/85 shadow-[0_8px_30px_-18px_rgb(10_30_70/0.35)] backdrop-blur-xl"
          : "border-transparent bg-bg",
      )}
    >
      <Container className="flex h-18 items-center justify-between gap-4">
        <a href={sectionHref("home")} aria-label={`${siteConfig.name} — back to top`} onClick={closeMenu}>
          <Logo />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={sectionHref(item.id)}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "relative rounded-full px-3.5 py-2 text-[14.5px] font-medium transition-colors",
                      active ? "text-brand" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-3.5 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a href={sectionHref("contact")} className={buttonClasses({ size: "md", className: "max-sm:hidden" })}>
            <CalendarCheck aria-hidden className="size-4" />
            Book Appointment
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-fg lg:hidden"
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="h-[calc(100dvh-72px)] overflow-y-auto border-t border-border bg-bg lg:hidden"
      >
        <Container className="flex flex-col gap-1 py-6">
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {mainNav.map((item) => (
                <li key={item.id}>
                  <a
                    href={sectionHref(item.id)}
                    onClick={closeMenu}
                    className={cn(
                      "flex items-center justify-between border-b border-border py-4 font-display text-lg font-semibold",
                      activeId === item.id ? "text-brand" : "text-fg",
                    )}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-6 grid gap-3">
            <a href={sectionHref("contact")} onClick={closeMenu} className={buttonClasses({ size: "lg" })}>
              <CalendarCheck aria-hidden className="size-5" />
              Book Appointment
            </a>
            <a href={telHref(primaryPhone)} className={buttonClasses({ variant: "outline", size: "lg" })}>
              <Phone aria-hidden className="size-5" />
              Call {primaryPhone.display}
            </a>
          </div>
        </Container>
      </div>
    </header>
  );
}

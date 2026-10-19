import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { getSite } from "@/lib/cms/get-site";
import { bookAction, callAction, isSectionVisible, visibleNavigation } from "@/lib/cms/selectors";
import type { Site } from "@/lib/cms/types";
import { siteMetadata, unavailableMetadata } from "@/lib/seo/metadata";
import { themeInitScript } from "@/features/theme/theme-script";
import { TopBar } from "@/components/layout/TopBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { SiteUnavailable } from "@/components/layout/SiteUnavailable";
import { Logo } from "@/components/ui/Logo";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const jakarta = Plus_Jakarta_Sans({ variable: "--font-jakarta", subsets: ["latin"], display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return site ? siteMetadata(site) : unavailableMetadata;
}

export async function generateViewport(): Promise<Viewport> {
  const site = await getSite();
  return {
    themeColor: site?.documents["site.identity"].themeColor || undefined,
    width: "device-width",
    initialScale: 1,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getSite();

  return (
    // data-theme / data-js are added by the init script before paint, so hydration must tolerate them.
    <html
      // The built-in UI text is English, so "en" is the honest default.
      lang={site?.documents["site.identity"].language || "en"}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${jakarta.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">{site ? <SiteChrome site={site}>{children}</SiteChrome> : <SiteUnavailable />}</body>
    </html>
  );
}

function SiteChrome({ site, children }: { site: Site; children: ReactNode }) {
  const identity = site.documents["site.identity"];
  const layout = site.documents["site.layout"];

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-full focus:bg-primary focus:px-5 focus:py-2.5 focus:text-primary-fg"
      >
        Skip to content
      </a>
      {layout.topBarEnabled && <TopBar site={site} />}
      <SiteHeader
        logo={<Logo identity={identity} />}
        homeLabel={identity.name ? `${identity.name} — back to top` : "Back to top"}
        homeHref={isSectionVisible(site, "hero") ? "#home" : "#main"}
        navigation={visibleNavigation(site)}
        bookAction={bookAction(site, layout.bookButtonLabel)}
        callAction={callAction(site)}
      />
      <main id="main">{children}</main>
      <SiteFooter site={site} />
      <FloatingContact site={site} />
    </>
  );
}

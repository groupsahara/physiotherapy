# Moving Cure — Clinic Website

Public website of the physiotherapy clinic platform. Every piece of business content — clinic
name, contact details, treatments, FAQs, photos, page copy, section order, menu, SEO and the
appointment-form options — comes from the backend CMS (`backend_phy`) and is edited by staff in
the admin console (`admin_phy`). The website itself only holds the design.

Built with Next.js 16 (App Router, Cache Components), React 19, TypeScript, Tailwind CSS 4 and Zod.
White theme by default with a blue dark theme toggle.

## Sections

Hero · Credentials strip · About · Treatments · Our Approach · Session gallery (lightbox) ·
Home-visit banner · Patient stories · FAQ · Contact & appointment booking (with map) · Footer.

Order and visibility come from the CMS (*Layout & navigation*). A section whose collection is empty
(e.g. no published testimonials) is hidden automatically, together with its menu link.

## Getting started

| Port | App |
| --- | --- |
| 3000 | Backend API (`backend_phy`) |
| 3001 | Admin console (`admin_phy`) |
| 3002 | This website |

```bash
npm install
cp .env.example .env.local   # point API_URL at the backend
npm run dev        # http://localhost:3002
npm run build      # production build (pages prerendered from the CMS)
npm start          # serve the production build on :3002
npm run lint
```

The build does not need the API: if it is unreachable, pages are prerendered as a brand-less
"We'll be right back" page that is cached for 30 seconds only, so the site fills in by itself once
the API is up (the build log says so). Start the backend first to prerender the real content.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public origin of the site — canonical links, sitemap, robots, social cards |
| `API_URL` | Backend origin (server-only). Default `http://localhost:3000` |
| `WEBSITE_API_KEY` | Sent as `x-site-key` with appointment requests; equals the backend's `WEBSITE_API_KEY` |
| `REVALIDATE_SECRET` | Secret for `POST /api/revalidate`; equals the backend's `WEBSITE_REVALIDATE_SECRET` |
| `MEDIA_ORIGINS` | Extra comma-separated origins that serve CMS images (e.g. the backend's `MEDIA_PUBLIC_BASE_URL`, a CDN). `$API_URL/media/**` is always allowed |
| `RESEND_API_KEY`, `APPOINTMENT_EMAIL_TO`, `APPOINTMENT_EMAIL_FROM` | Optional: also email each request to the clinic via [Resend](https://resend.com) |
| `APPOINTMENT_WEBHOOK_URL` | Optional: also POST each request as JSON (Slack, Discord, Zapier, Google Sheets via Apps Script…) |

On the backend, set `WEBSITE_REVALIDATE_URL=https://<site>/api/revalidate` and the matching
secret so content changes appear right away.

## Editing content

Everything is edited in the admin console's website-content (CMS) screens and goes live on save:
the backend calls `POST /api/revalidate` and the site shows the change from the next visit on.
The CMS groups and forms below come from the backend's content registry.

| What | CMS group → form |
| --- | --- |
| Name, logo, theme colour, language, time zone | Site & brand → Brand & identity |
| Page title, description, keywords, share image | Site & brand → Search & social |
| Phones, WhatsApp, email, address, map listing | Site & brand → Contact details |
| Practitioner name and qualifications | Site & brand → Lead practitioner |
| Section order / visibility, menu, header button, top bar | Site & brand → Layout & navigation |
| Section copy (hero, about, footer, 404…) | Page sections |
| Treatments, credentials, reasons, approach steps, gallery, testimonials, FAQs | Page sections → collections |
| Appointment form options and messages | Appointment form |
| Photos | Upload in the admin console (served by the API), or reference files in `public/images/` as `/images/<name>.jpg` |
| Colours (light / dark) | Design tokens at the top of `src/app/globals.css` (code) |

Testimonials are seeded as unpublished drafts: publish only real, consented patient feedback.

## Appointment requests

The form posts to a Server Action that validates the input against the current CMS form
configuration and stores the request in the backend's **website enquiries** inbox
(`POST /api/v1/public/enquiries`), which issues the reference shown to the patient. Optional
email/webhook channels receive a copy. If the backend cannot be reached, the patient gets a local
reference and is asked to confirm on WhatsApp (pre-filled message) or by phone.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the data flow, caching, low-level design and
extension points.

## Photo credits

The initial session photos in `public/images/` are royalty-free stock images from Pexels and
Unsplash; their credits are stored with each gallery item in the CMS. Replace them with real clinic
photos whenever available.

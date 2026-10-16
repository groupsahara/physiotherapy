# Moving Cure — Physiotherapy Clinic Website

Website for **Moving Cure Physiotherapy Clinic & Rehabilitation Centre**, Vishwas Nagar, Delhi —
Dr. Deepak, BPT (D.U.), DCPT.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 and Zod.
White theme by default with a blue dark theme toggle.

## Sections

Hero · Credentials strip · About · Treatments (8 conditions) · Our Approach · Session gallery (lightbox) ·
Home-visit banner · Patient stories · FAQ · Contact & appointment booking (with map) · Footer.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all routes prerendered)
npm start          # serve the production build
npm run lint
```

Copy `.env.example` to `.env.local` and fill in what you need — everything is optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical links, sitemap and social cards |
| `RESEND_API_KEY`, `APPOINTMENT_EMAIL_TO`, `APPOINTMENT_EMAIL_FROM` | Email each booking to the clinic via [Resend](https://resend.com) |
| `APPOINTMENT_WEBHOOK_URL` | POST each booking as JSON (Slack, Discord, Zapier, Google Sheets via Apps Script…) |

Without a delivery channel, bookings are logged on the server and the patient is asked to confirm on
WhatsApp (pre-filled message) or by phone.

## Editing content

| What | Where |
| --- | --- |
| Clinic name, phones, email, address, WhatsApp number | `src/config/site.ts` |
| Treatments | `src/content/services.ts` |
| FAQs | `src/content/faqs.ts` |
| Testimonials (**samples — replace before launch**) | `src/content/testimonials.ts` |
| Photos and captions | `src/assets/images/` + `src/content/media.ts` |
| Colours (light / dark) | tokens at the top of `src/app/globals.css` |

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system design, low-level design, diagrams and
extension points.

## Photo credits

Session photos are royalty-free stock images from Pexels and Unsplash (sources listed in
`src/content/media.ts`). Replace them with real clinic photos whenever available.

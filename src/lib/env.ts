import "server-only";
import { z } from "zod";
import { getApiBaseUrl } from "@/lib/cms/origins";

/**
 * Server-side environment, validated at first use. Groups are validated separately so
 * a typo in one optional channel never takes down an unrelated feature.
 */

export interface ApiEnv {
  /** Backend origin without trailing slash (env `API_URL`). */
  baseUrl: string;
  /** Sent as `x-site-key` on public write endpoints (env `WEBSITE_API_KEY`). */
  siteKey: string | undefined;
}

let apiEnv: ApiEnv | undefined;

/** Throws when `API_URL` is not an http(s) URL. */
export function getApiEnv(): ApiEnv {
  apiEnv ??= {
    baseUrl: z
      .url({ protocol: /^https?$/, error: "API_URL must be an http(s) URL" })
      .parse(getApiBaseUrl()),
    siteKey: process.env.WEBSITE_API_KEY?.trim() || undefined,
  };
  return apiEnv;
}

/** Shared secret the backend sends to `POST /api/revalidate` (env `REVALIDATE_SECRET`). */
export function getRevalidateSecret(): string | undefined {
  return process.env.REVALIDATE_SECRET?.trim() || undefined;
}

/** Optional extra delivery channels for appointment requests. */
const notifierEnvSchema = z.object({
  /** POST target for new bookings (Slack, Discord, Zapier, Make, Google Apps Script…). */
  APPOINTMENT_WEBHOOK_URL: z.url().optional(),
  /** Enables email delivery through Resend (https://resend.com). */
  RESEND_API_KEY: z.string().min(1).optional(),
  /** Defaults to the clinic email from the CMS. */
  APPOINTMENT_EMAIL_TO: z.email().optional(),
  /** Defaults to "<clinic name> <onboarding@resend.dev>". */
  APPOINTMENT_EMAIL_FROM: z.string().min(3).optional(),
});

export type NotifierEnv = z.infer<typeof notifierEnvSchema>;

let notifierEnv: NotifierEnv | undefined;

export function getNotifierEnv(): NotifierEnv {
  notifierEnv ??= notifierEnvSchema.parse({
    APPOINTMENT_WEBHOOK_URL: process.env.APPOINTMENT_WEBHOOK_URL || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    APPOINTMENT_EMAIL_TO: process.env.APPOINTMENT_EMAIL_TO || undefined,
    APPOINTMENT_EMAIL_FROM: process.env.APPOINTMENT_EMAIL_FROM || undefined,
  });
  return notifierEnv;
}

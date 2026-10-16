import "server-only";
import { z } from "zod";
import { siteConfig } from "@/config/site";

/**
 * Server-side environment, validated once at first use. Every variable is
 * optional so the site works out of the box; each one unlocks a channel.
 */
const envSchema = z.object({
  /** POST target for new bookings (Slack, Discord, Zapier, Make, Google Apps Script…). */
  APPOINTMENT_WEBHOOK_URL: z.url().optional(),
  /** Enables email delivery through Resend (https://resend.com). */
  RESEND_API_KEY: z.string().min(1).optional(),
  APPOINTMENT_EMAIL_TO: z.email().default(siteConfig.contact.email),
  APPOINTMENT_EMAIL_FROM: z.string().min(3).default("Moving Cure Website <onboarding@resend.dev>"),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  cached ??= envSchema.parse({
    APPOINTMENT_WEBHOOK_URL: process.env.APPOINTMENT_WEBHOOK_URL || undefined,
    RESEND_API_KEY: process.env.RESEND_API_KEY || undefined,
    APPOINTMENT_EMAIL_TO: process.env.APPOINTMENT_EMAIL_TO || undefined,
    APPOINTMENT_EMAIL_FROM: process.env.APPOINTMENT_EMAIL_FROM || undefined,
  });
  return cached;
}

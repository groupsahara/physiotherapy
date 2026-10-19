import { createHash, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { SITE_CACHE_TAG } from "@/lib/cms/get-site";
import { getRevalidateSecret } from "@/lib/env";

/** Hashing first gives equal-length buffers, so the comparison leaks neither content nor length. */
function isSameSecret(provided: string, expected: string): boolean {
  const digest = (value: string) => createHash("sha256").update(value).digest();
  return timingSafeEqual(digest(provided), digest(expected));
}

/**
 * On-demand revalidation, called by the backend after every CMS change with the
 * `x-revalidate-secret` header. Marks all CMS-derived cache entries stale: the next
 * visitor still gets the cached page instantly while fresh content renders in the
 * background (stale-while-revalidate), and everyone after that sees the new content.
 */
export async function POST(request: Request) {
  const secret = getRevalidateSecret();
  if (!secret) {
    return Response.json({ revalidated: false, error: "REVALIDATE_SECRET is not configured" }, { status: 503 });
  }

  if (!isSameSecret(request.headers.get("x-revalidate-secret") ?? "", secret)) {
    return Response.json({ revalidated: false, error: "Invalid revalidation secret" }, { status: 401 });
  }

  revalidateTag(SITE_CACHE_TAG, "max");
  return Response.json({ revalidated: true, tag: SITE_CACHE_TAG });
}

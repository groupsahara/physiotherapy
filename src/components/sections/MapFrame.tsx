"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * The map embed, with a shimmering skeleton in its place until it has loaded. Its box must be
 * positioned; the frame is stacked above the skeleton, so the map covers it even if the load
 * event came before hydration.
 */
export function MapFrame({ title, src, className }: { title: string; src: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {loaded ? null : <span aria-hidden className="skeleton absolute inset-0" />}
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)}
        className={cn("relative", className)}
      />
    </>
  );
}

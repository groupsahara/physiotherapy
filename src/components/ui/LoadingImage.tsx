"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

type LoadingImageProps = Omit<ImageProps, "onLoad" | "onError"> & {
  /** Classes for the placeholder when it should not be a plain block, e.g. a radius or a mask. */
  skeletonClassName?: string;
};

/**
 * `next/image` with a shimmering skeleton in its place until the picture has loaded (or failed).
 * The image must `fill` a positioned box. The skeleton fills the same box beneath it, so a
 * partly decoded picture already paints over it, and it is removed — animation and all — on load.
 */
export function LoadingImage({ alt, skeletonClassName, ...props }: LoadingImageProps) {
  const [loaded, setLoaded] = useState(false);
  const done = () => setLoaded(true);

  return (
    <>
      {loaded ? null : <span aria-hidden className={cn("skeleton absolute inset-0 rounded-[inherit]", skeletonClassName)} />}
      <Image {...props} alt={alt} onLoad={done} onError={done} />
    </>
  );
}

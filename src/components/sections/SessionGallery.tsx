"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { SessionPhoto } from "@/types/content";
import { cn } from "@/lib/cn";

/** Bento layout slots — index-aligned with the photo list. */
const tileLayout = [
  "col-span-2 row-span-2",
  "",
  "",
  "",
  "",
  "col-span-2",
  "",
  "",
];

export function SessionGallery({ photos }: { photos: readonly SessionPhoto[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = (index: number) => {
    setActiveIndex(index);
    dialogRef.current?.showModal();
  };

  const close = useCallback(() => dialogRef.current?.close(), []);

  const step = useCallback(
    (delta: number) =>
      setActiveIndex((index) => (index === null ? index : (index + delta + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeIndex, step]);

  const active = activeIndex === null ? null : photos[activeIndex];

  return (
    <>
      <ul className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[200px] sm:gap-4 lg:auto-rows-[230px] lg:grid-cols-4">
        {photos.map((photo, index) => (
          <li key={photo.id} className={cn("min-h-0", tileLayout[index % tileLayout.length])}>
            <button
              type="button"
              onClick={() => open(index)}
              aria-label={`View photo: ${photo.title}`}
              className="group relative block size-full overflow-hidden rounded-2xl bg-surface-2 text-left sm:rounded-3xl"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                placeholder="blur"
                sizes={index === 0 ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#04112a]/85 via-[#04112a]/10 to-transparent" />
              <span className="absolute top-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold tracking-wide text-[#0b3a8c] uppercase backdrop-blur sm:top-4 sm:left-4">
                {photo.tag}
              </span>
              <span
                aria-hidden
                className="absolute top-3 right-3 flex size-9 scale-75 items-center justify-center rounded-full bg-white/90 text-[#0b3a8c] opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100 sm:top-4 sm:right-4"
              >
                <Expand className="size-4" />
              </span>
              <span className="absolute inset-x-0 bottom-0 p-3.5 text-white sm:p-5">
                <span className="block font-display text-[15px] font-bold sm:text-lg">{photo.title}</span>
                <span
                  className={cn(
                    "mt-1 text-sm leading-snug text-white/80",
                    index === 0 ? "hidden sm:block" : "hidden lg:line-clamp-2",
                  )}
                >
                  {photo.caption}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onClose={() => setActiveIndex(null)}
        onClick={(event) => event.target === event.currentTarget && close()}
        aria-label={active ? active.title : "Session photo"}
        className="m-auto max-h-none w-[min(100vw_-_2rem,72rem)] max-w-none overflow-visible bg-transparent p-0 outline-none backdrop:bg-[#020814]/90 backdrop:backdrop-blur-sm"
      >
        {active && (
          <figure className="relative">
            <div className="relative aspect-3/2 max-h-[75vh] w-full overflow-hidden rounded-2xl bg-black">
              <Image
                key={active.id}
                src={active.src}
                alt={active.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1152px) 72rem, 100vw"
                className="object-contain"
              />
            </div>
            <figcaption className="mt-4 flex flex-col gap-2 text-white sm:flex-row sm:items-end sm:justify-between">
              <span>
                <span className="block font-display text-lg font-bold">{active.title}</span>
                <span className="text-sm text-white/75">{active.caption}</span>
              </span>
              <span className="shrink-0 text-xs text-white/50">
                {(activeIndex ?? 0) + 1} / {photos.length} · Photo:{" "}
                <a href={active.credit.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
                  {active.credit.source}
                </a>
              </span>
            </figcaption>

            <button type="button" onClick={close} aria-label="Close" className={cn(navButton, "-top-3 -right-3 sm:-top-5 sm:-right-5")}>
              <X aria-hidden className="size-5" />
            </button>
            <button type="button" onClick={() => step(-1)} aria-label="Previous photo" className={cn(navButton, "top-[37%] left-2 sm:-left-5")}>
              <ChevronLeft aria-hidden className="size-6" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next photo" className={cn(navButton, "top-[37%] right-2 sm:-right-5")}>
              <ChevronRight aria-hidden className="size-6" />
            </button>
          </figure>
        )}
      </dialog>
    </>
  );
}

const navButton =
  "absolute flex size-11 items-center justify-center rounded-full bg-white text-[#0a1a33] shadow-lift transition-transform hover:scale-105";

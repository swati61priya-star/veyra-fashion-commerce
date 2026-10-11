"use client";
import { useState } from "react";

export default function ProductImage({
  src,
  name,
  category,
  color,
  priority = false,
  className = "",
}: {
  src?: string | null;
  name: string;
  category: string;
  color?: string;
  priority?: boolean;
  className?: string;
}) {
  const [bad, setBad] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const resolvedSrc = src ? src.split(",")[0].trim() : null;

  if (resolvedSrc && !bad) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolvedSrc}
        alt={name}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        onError={() => setBad(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    );
  }

  // No illustrations: if a photo is missing or fails to load, show a plain neutral tile.
  return (
    <div role="img" aria-label={`${name} (photo unavailable)`} className={`flex h-full w-full items-center justify-center bg-stone-100 text-xs uppercase tracking-widest text-stone-400 ${className}`}>
      Photo unavailable
    </div>
  );
}

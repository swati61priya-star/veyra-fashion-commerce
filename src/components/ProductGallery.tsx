"use client";
import { useState } from "react";
import ProductImage from "./ProductImage";

export default function ProductGallery({
  images,
  name,
  category,
  selectedColor,
}: {
  images: string[];
  name: string;
  category: string;
  selectedColor: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  // If there are multiple photos, activeSrc is the chosen one; otherwise images[0] or null
  const activeSrc = images.length > 0 ? images[activeIndex] : null;

  return (
    <div className="flex flex-col gap-4 lg:sticky lg:top-36 lg:self-start">
      {/* Main Large Image Stage */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-sand/40 shadow-sm border border-ink/5">
        <ProductImage
          src={activeSrc}
          name={name}
          category={category}
          color={selectedColor}
          priority={true}
          className="h-full w-full object-cover transition-all duration-300"
        />

        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 rounded-full bg-ink/75 px-3 py-1 text-[11px] font-medium tracking-widest text-white backdrop-blur">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails Navigation */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`View photo ${idx + 1}`}
              className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-xl bg-sand/40 border-2 transition-all ${
                activeIndex === idx
                  ? "border-terracotta shadow-md scale-[1.02]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <ProductImage
                src={img}
                name={`${name} angle ${idx + 1}`}
                category={category}
                color={selectedColor}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

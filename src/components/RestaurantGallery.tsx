"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type RestaurantGalleryProps = {
  images: string[];
  restaurantName: string;
};

export function RestaurantGallery({ images, restaurantName }: RestaurantGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isOpen = activeIndex !== null;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? null : (current - 1 + images.length) % images.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) =>
          current === null ? null : (current + 1) % images.length,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [images.length, isOpen]);

  function showPrevious() {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length,
    );
  }

  function showNext() {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  }

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`Ampliar foto ${index + 1} de ${restaurantName}`}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-[24px] bg-stone-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700"
          >
            <Image
              src={image}
              alt={`Foto ${index + 1} de ${restaurantName} en Granada, Nicaragua`}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-stone-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              Ver en grande
            </span>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${restaurantName}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/95 p-4 sm:p-8"
          onClick={() => setActiveIndex(null)}
        >
          <button
            type="button"
            onClick={() => setActiveIndex(null)}
            aria-label="Cerrar galería"
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20 sm:right-8 sm:top-8"
          >
            Cerrar ×
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showPrevious();
              }}
              aria-label="Foto anterior"
              className="absolute left-3 z-10 rounded-full bg-white/10 p-4 text-2xl text-white backdrop-blur transition hover:bg-white/20 sm:left-8"
            >
              ‹
            </button>
          )}

          <div
            className="relative h-[82vh] w-full max-w-6xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`Foto ampliada ${activeIndex + 1} de ${restaurantName}`}
              fill
              priority
              sizes="100vw"
              className="object-contain"
            />
          </div>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                showNext();
              }}
              aria-label="Foto siguiente"
              className="absolute right-3 z-10 rounded-full bg-white/10 p-4 text-2xl text-white backdrop-blur transition hover:bg-white/20 sm:right-8"
            >
              ›
            </button>
          )}

          <p className="absolute bottom-3 rounded-full bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur sm:bottom-6">
            {activeIndex + 1} de {images.length}
          </p>
        </div>
      )}
    </>
  );
}

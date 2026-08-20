"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import type { Restaurant, MenuItem } from "@/lib/types";

type ZoomableVideoTrack = MediaStreamTrack;
type CameraCapabilities = {
  getCapabilities?: () => Omit<MediaTrackCapabilities, "zoom"> & {
    zoom?: { min?: number; max?: number; step?: number };
  };
};

interface TablePreviewProps {
  restaurant: Restaurant;
  dish: MenuItem;
  image?: string;
}

export default function TablePreview({
  restaurant,
  dish,
  image,
}: TablePreviewProps) {
  const dishName = dish.name;
  const dishPrice = dish.price;
  const dishImage = image;
  const restaurantName = restaurant.name;
  const [showConfirm, setShowConfirm] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const trackRef = useRef<ZoomableVideoTrack | null>(null);
  const [cameraZoom, setCameraZoom] = useState(1);
  const zoomRangeRef = useRef({ min: 1, max: 1 });
  const lastDistRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const open = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
      });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0] as ZoomableVideoTrack | undefined;
      trackRef.current = track ?? null;
      const zoom = (track as unknown as CameraCapabilities | undefined)?.getCapabilities?.().zoom;
      const min = zoom?.min ?? 1;
      const max = zoom?.max ?? 1;
      zoomRangeRef.current = { min, max };
      setCameraZoom(min);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsOpen(true);
      setShowConfirm(false);
    } catch {
      alert("No se pudo acceder a la cámara. Por favor, habilitá el permiso.");
    }
  }, []);

  const close = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    trackRef.current = null;
    setIsOpen(false);
    setCameraZoom(1);
  }, []);

  const updateCameraZoom = useCallback((nextZoom: number) => {
    const track = trackRef.current;
    const { min, max } = zoomRangeRef.current;
    const zoom = Math.min(Math.max(nextZoom, min), max);

    setCameraZoom(zoom);
    if (track && max > min) {
      void track.applyConstraints({ advanced: [{ zoom } as MediaTrackConstraintSet] }).catch(() => {
        // Algunos navegadores exponen la capacidad de zoom pero no permiten cambiarla.
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const el = containerRef.current;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      updateCameraZoom(cameraZoom - e.deltaY * 0.002);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDistRef.current = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (lastDistRef.current > 0) {
          const delta = dist / lastDistRef.current;
          updateCameraZoom(cameraZoom * delta);
        }
        lastDistRef.current = dist;
      }
    };

    const onTouchEnd = () => {
      lastDistRef.current = 0;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [cameraZoom, isOpen, updateCameraZoom]);

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm"
      >
        Ver en tu mesa
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg text-gray-900 mb-1">{dishName}</h3>
            <p className="text-emerald-600 font-semibold mb-3">{dishPrice}</p>
            <p className="text-gray-500 text-sm mb-5">
              Se abrirá la cámara para ver cómo queda este plato en tu mesa.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={open}
                className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition-colors"
              >
                Abrir cámara
              </button>
            </div>
          </div>
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[70] bg-black" ref={containerRef}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-[7%] flex justify-center px-4">
            <div className="relative aspect-[4/3] w-[min(88vw,32rem)]">
              <div className="absolute inset-x-[7%] bottom-[3%] h-[27%] rounded-[50%] bg-amber-950/90 shadow-[0_24px_45px_rgba(0,0,0,0.48)]" />
              <div className="absolute inset-x-[11%] bottom-[7%] h-[20%] rounded-[50%] bg-gradient-to-b from-amber-700 via-amber-900 to-amber-950" />
              <div className="absolute left-1/2 top-[5%] h-[78%] w-[78%] -translate-x-1/2 overflow-hidden rounded-[50%] border-[8px] border-stone-100 bg-stone-50 shadow-[0_18px_42px_rgba(0,0,0,0.38)]">
                {dishImage ? (
                  <Image
                    src={dishImage}
                    alt={dishName}
                    fill
                    sizes="(max-width: 640px) 88vw, 512px"
                    className="object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl">🍽️</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-white/10" />
              </div>
            </div>
          </div>

          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
            <div className="text-white">
              <p className="font-bold text-base">{dishName}</p>
              <p className="text-emerald-300 text-sm font-medium">
                {dishPrice} · {restaurantName}
              </p>
            </div>
            <button
              onClick={close}
              aria-label="Cerrar vista de mesa"
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 pb-8 bg-gradient-to-t from-black/40 to-transparent">
            <p className="text-white/70 text-xs text-center">
              Mové el teléfono para explorar la mesa. Pellizcá para acercar la cámara.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import type { MenuItem } from "@/lib/types";

type ZoomableVideoTrack = MediaStreamTrack;
type CameraCapabilities = {
  getCapabilities?: () => Omit<MediaTrackCapabilities, "zoom"> & {
    zoom?: { min?: number; max?: number; step?: number };
  };
};

interface TablePreviewProps {
  dish: MenuItem;
  image?: string;
}

export default function TablePreview({ dish, image }: TablePreviewProps) {
  const dishName = dish.name;
  const dishImage = image;
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
    } catch {
      alert("No se pudo acceder a la cámara. Por favor, habilitá el permiso.");
    }
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
        onClick={open}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-sm"
      >
        Ver en tu mesa
      </button>

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
        </div>
      )}
    </>
  );
}

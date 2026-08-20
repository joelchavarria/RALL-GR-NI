"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { TouchEvent } from "react";
import type { MenuItem, Restaurant } from "@/lib/types";

type TablePreviewProps = {
  restaurant: Pick<Restaurant, "name" | "heroImage" | "gallery" | "menu">;
  dish?: MenuItem;
  image?: string;
};

type Step = "confirm" | "viewer";

export function TablePreview({ restaurant, dish, image }: TablePreviewProps) {
  const [step, setStep] = useState<Step | null>(null);
  const [mode, setMode] = useState<"ar" | "object">("ar");
  const [lifted, setLifted] = useState(false);
  const [scale, setScale] = useState(1);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const pinchStartDistance = useRef<number | null>(null);
  const pinchStartScale = useRef(1);

  const selectedDish = dish ?? restaurant.menu[0];
  const previewImage = useMemo(
    () => image ?? restaurant.gallery[0] ?? restaurant.heroImage,
    [image, restaurant.gallery, restaurant.heroImage],
  );

  useEffect(() => {
    if (step !== "viewer") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        stopCamera();
        setStep(null);
        setLifted(false);
        setCameraReady(false);
        setCameraError(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      void videoRef.current.play();
      setCameraReady(true);
      const timer = window.setTimeout(() => setLifted(true), 120);

      return () => {
        document.body.style.overflow = previousOverflow;
        window.removeEventListener("keydown", handleKeyDown);
        window.clearTimeout(timer);
        stopCamera();
        setLifted(false);
        setCameraReady(false);
        setCameraError(null);
      };
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      stopCamera();
      setLifted(false);
      setCameraReady(false);
      setCameraError(null);
    };
  }, [step]);

  function openConfirm() {
    setStep("confirm");
  }

  async function openViewer() {
    setCameraError(null);
    setCameraReady(false);

    if (!window.isSecureContext) {
      setCameraError(
        "La camara requiere HTTPS o localhost. Abre el sitio en una conexion segura.",
      );
      setStep("viewer");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Tu navegador no soporta camara.");
      setStep("viewer");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;
      setStep("viewer");
    } catch {
      setCameraError("No pudimos activar la camara. Revisa permisos.");
      setStep("viewer");
    }
  }

  function closeViewer() {
    stopCamera();
    setStep(null);
    setLifted(false);
    setScale(1);
    setCameraReady(false);
    setCameraError(null);
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 2) return;

    event.preventDefault();

    const touchA = event.touches[0];
    const touchB = event.touches[1];
    pinchStartDistance.current = distance(touchA, touchB);
    pinchStartScale.current = scale;
  }

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 2 || pinchStartDistance.current === null) return;

    event.preventDefault();

    const touchA = event.touches[0];
    const touchB = event.touches[1];
    const currentDistance = distance(touchA, touchB);
    const nextScale = clamp(
      pinchStartScale.current * (currentDistance / pinchStartDistance.current),
      0.7,
      1.6,
    );

    setScale(nextScale);
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    if (event.touches.length < 2) {
      pinchStartDistance.current = null;
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={openConfirm}
        className="inline-flex items-center justify-center rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/20 transition hover:bg-emerald-800"
      >
        Ver en tu mesa
      </button>

      {step === "confirm" ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Ver en AR de ${selectedDish?.name ?? restaurant.name}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeViewer}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/15 bg-white/92 p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#fff7ed_0%,#f7efe7_55%,#e7d8ca_100%)] opacity-90" />
            <div className="relative">
              <h3 className="text-2xl font-semibold text-stone-950">¿Ver en AR?</h3>
              <p className="mt-3 text-lg leading-7 text-stone-700">
                Puedes ver este objeto en 3D y colocarlo en tu entorno mediante la
                realidad aumentada.
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={closeViewer}
                  className="flex-1 rounded-full bg-stone-200 px-4 py-3 text-sm font-semibold text-stone-950 transition hover:bg-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={openViewer}
                  className="flex-1 rounded-full bg-stone-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                >
                  Ver en AR
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {step === "viewer" ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Vista AR de ${selectedDish?.name ?? restaurant.name}`}
          className="fixed inset-0 z-[100] bg-transparent"
          onClick={closeViewer}
        >
          <div
            className="relative h-full w-full overflow-hidden bg-transparent"
            style={{ touchAction: "none" }}
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <video
              ref={videoRef}
              className="absolute inset-0 h-full w-full object-cover"
              playsInline
              muted
              autoPlay
            />

            <div className="absolute inset-0 bg-transparent" />

            <div className="absolute left-1/2 top-5 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 p-1.5 text-stone-950 backdrop-blur-md shadow-lg">
              <button
                type="button"
                onClick={() => setMode("ar")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  mode === "ar" ? "bg-stone-950 text-white" : "text-stone-600"
                }`}
              >
                AR
              </button>
              <button
                type="button"
                onClick={() => setMode("object")}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                  mode === "object" ? "bg-stone-950 text-white" : "text-stone-600"
                }`}
              >
                Objeto
              </button>
            </div>

            <button
              type="button"
              onClick={closeViewer}
              className="absolute left-4 top-5 grid size-12 place-items-center rounded-full bg-white/90 text-2xl text-stone-950 shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="Cerrar"
            >
              ×
            </button>

            <div className="absolute inset-x-0 bottom-[12vh] flex justify-center px-6">
              <div
                className="relative transition-all duration-700 ease-out"
                style={{
                  transform: `translateY(${lifted ? -8 : 8}px) scale(${scale}) rotate(${mode === "object" ? -1 : 0}deg)`,
                }}
              >
                <div className="absolute inset-x-6 bottom-4 h-12 rounded-full bg-black/15 blur-2xl" />
                <div className="relative aspect-square w-[min(88vw,34rem)]">
                  <div className="absolute inset-x-8 top-3 h-14 rounded-full bg-white/10 blur-2xl" />

                  <div
                    className={`absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out ${
                      lifted ? "translate-y-[-50%]" : "translate-y-[-38%]"
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-full bg-transparent shadow-none">
                      <Image
                        src={previewImage}
                        alt={`Vista previa de ${selectedDish?.name ?? restaurant.name}`}
                        fill
                        sizes="(max-width: 1024px) 90vw, 520px"
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!cameraReady && !cameraError ? (
              <div className="absolute inset-0 grid place-items-center">
                <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-stone-950 backdrop-blur">
                  Activando camara...
                </div>
              </div>
            ) : null}

            {cameraError ? (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-stone-950 shadow-lg backdrop-blur">
                {cameraError}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function distance(
  touchA: { clientX: number; clientY: number },
  touchB: { clientX: number; clientY: number },
) {
  return Math.hypot(touchA.clientX - touchB.clientX, touchA.clientY - touchB.clientY);
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

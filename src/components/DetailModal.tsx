"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, Award, Check, Copy, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Vehicle } from "./VehicleCard";

interface DetailModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

function DetailTag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${className}`}
    >
      {children}
    </span>
  );
}

export default function DetailModal({
  vehicle,
  onClose,
  isFavorite,
  onToggleFavorite,
}: DetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveImageIndex(0);
  }, [vehicle?.id]);

  if (!vehicle) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${vehicle.name} (${vehicle.series})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!vehicle.images || vehicle.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!vehicle.images || vehicle.images.length <= 1) return;
    setActiveImageIndex((prev) => (prev === vehicle.images.length - 1 ? 0 : prev + 1));
  };

  const hasMultipleImages = vehicle.images && vehicle.images.length > 1;
  const activeImage = vehicle.images?.[activeImageIndex];

  return (
    <Dialog open={!!vehicle} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex w-[calc(100%-1.25rem)] max-w-md max-h-[min(92dvh,760px)] flex-col gap-0 overflow-y-auto rounded-2xl border border-border bg-background p-0 shadow-2xl sm:max-w-lg md:max-w-4xl md:max-h-[92vh] md:flex-row md:overflow-hidden">
        <div className="sr-only">
          <DialogTitle>{vehicle.name}</DialogTitle>
        </div>

        {/* Image gallery — prioritized height */}
        <div className="relative w-full shrink-0 bg-muted/20 p-2 border-b border-border sm:p-3 md:w-[55%] md:p-4 md:border-b-0 md:border-r">
          {vehicle.id > 212 && (
            <div className="absolute top-3 left-3 z-10">
              <DetailTag className="border-blue-400/30 bg-blue-600/95 text-white backdrop-blur-sm">
                New
              </DetailTag>
            </div>
          )}

          <div className="relative flex items-center justify-center px-6 pt-1">
            {activeImage ? (
              <div className="relative h-52 w-full sm:h-60 md:h-[min(52vh,420px)]">
                <Image
                  src={activeImage}
                  alt={vehicle.name}
                  fill
                  sizes="(max-width: 768px) 95vw, 55vw"
                  className="object-contain scale-[1.05] sm:scale-100"
                  priority
                />
              </div>
            ) : (
              <div className="flex h-52 items-center justify-center text-sm text-muted-foreground sm:h-60">
                No image available
              </div>
            )}

            {hasMultipleImages && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-0 rounded-full border border-border bg-background/95 p-1.5 text-foreground shadow-sm active:scale-95"
                  title="Previous image"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-0 rounded-full border border-border bg-background/95 p-1.5 text-foreground shadow-sm active:scale-95"
                  title="Next image"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>

          {hasMultipleImages && (
            <>
              <div className="mt-1 flex justify-center gap-1">
                {vehicle.images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1 rounded-full transition-all ${idx === activeImageIndex ? "w-3 bg-orange-500" : "w-1 bg-muted-foreground/30"
                      }`}
                  />
                ))}
              </div>
              <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {vehicle.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative shrink-0 h-11 w-14 overflow-hidden rounded-lg border bg-background active:scale-95 sm:h-12 sm:w-16 ${idx === activeImageIndex
                      ? "border-orange-500 ring-1 ring-orange-500/30"
                      : "border-border"
                      }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-contain p-0.5"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <div className="flex w-full flex-1 flex-col p-4 md:w-[45%] md:p-6 md:overflow-y-auto">
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex min-w-0 items-center gap-1.5 text-orange-500 text-[10px] font-bold uppercase tracking-widest sm:text-xs">
              <Award className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{vehicle.series}</span>
            </div>
            <DetailTag
              className={
                vehicle.available
                  ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  : "border-red-400/30 bg-red-500/15 text-red-700 dark:text-red-300"
              }
            >
              {vehicle.available ? "In stock" : "Sold out"}
            </DetailTag>
          </div>

          <h2 className="mt-2 text-base font-extrabold leading-snug text-foreground pr-6 sm:text-lg md:text-xl">
            {vehicle.name}
          </h2>

          {vehicle.original_title && vehicle.original_title !== vehicle.name && (
            <p className="mt-1 text-[11px] italic leading-normal text-muted-foreground sm:text-xs">
              {vehicle.original_title}
            </p>
          )}

          <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 border-y border-border py-3 text-xs sm:text-sm">
            <div>
              <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Scale
              </span>
              <span className="font-semibold">1:64 Die-cast</span>
            </div>
            <div>
              <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                Code
              </span>
              <span className="font-mono font-semibold">{vehicle.code || "N/A"}</span>
            </div>
            <div className="col-span-2">
              <span className="mb-0.5 block text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                SKU
              </span>
              <span className="block truncate font-mono text-[11px] sm:text-xs" title={vehicle.skus?.join(", ")}>
                {vehicle.skus?.length ? vehicle.skus.join(", ") : "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(vehicle.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-bold active:scale-[0.98] sm:text-sm ${isFavorite
                ? "border-red-500/50 bg-red-500/15 text-red-500"
                : "border-border bg-card text-foreground"
                }`}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Favorited" : "Favorite"}
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center rounded-xl border border-border bg-card px-3 py-2.5 active:bg-accent"
              title="Copy details"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

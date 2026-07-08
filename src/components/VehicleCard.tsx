"use client";

import React, { memo } from "react";
import Image from "next/image";
import { Heart, Maximize2 } from "lucide-react";

export interface Vehicle {
  id: number;
  name: string;
  original_title: string;
  images: string[];
  price: number;
  compare_at_price: number;
  series: string;
  code: string;
  handle: string;
  skus: string[];
  available: boolean;
}

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onSelect: (vehicle: Vehicle) => void;
}

const seriesColors: Record<string, string> = {
  "Fast & Furious": "bg-amber-500/15 text-amber-800 border-amber-500/25 dark:text-amber-300",
  "Neon Speeders": "bg-pink-500/15 text-pink-800 border-pink-500/25 dark:text-pink-300",
  "Pantone Monochrome": "bg-indigo-500/15 text-indigo-800 border-indigo-500/25 dark:text-indigo-300",
  "Pop Culture": "bg-purple-500/15 text-purple-800 border-purple-500/25 dark:text-purple-300",
  "Boulevard": "bg-blue-500/15 text-blue-800 border-blue-500/25 dark:text-blue-300",
  "Entertainment": "bg-cyan-500/15 text-cyan-800 border-cyan-500/25 dark:text-cyan-300",
  "Hot Ones": "bg-red-500/15 text-red-800 border-red-500/25 dark:text-red-300",
  "XL Series": "bg-emerald-500/15 text-emerald-800 border-emerald-500/25 dark:text-emerald-300",
  "F1 Racing": "bg-rose-500/15 text-rose-800 border-rose-500/25 dark:text-rose-300",
  "Pearl & Chrome": "bg-orange-500/15 text-orange-800 border-orange-500/25 dark:text-orange-300",
  "Mainline / Others": "bg-slate-500/15 text-slate-700 border-slate-500/25 dark:text-slate-300",
};

function CardTag({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex w-fit max-w-full items-center truncate rounded-full border px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide leading-none sm:px-2.5 sm:text-[9px] ${className}`}
    >
      {children}
    </span>
  );
}

function VehicleCard({
  vehicle,
  isFavorite,
  onToggleFavorite,
  onSelect,
}: VehicleCardProps) {
  const seriesStyle = seriesColors[vehicle.series] || seriesColors["Mainline / Others"];
  const primaryImage = vehicle.images?.[0];
  const hoverImage = vehicle.images?.[1];
  const hasHoverImage = Boolean(hoverImage);

  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-card text-card-foreground card-glow cursor-pointer shadow-sm"
      onClick={() => onSelect(vehicle)}
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-muted/20 p-1 sm:p-2">
        {primaryImage ? (
          <div className="relative h-full w-full">
            <Image
              src={primaryImage}
              alt={vehicle.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={`object-contain scale-[1.1] sm:scale-[1.08] transition-transform duration-500 ${
                hasHoverImage ? "md:group-hover:opacity-0 md:group-hover:scale-[1.14]" : "md:group-hover:scale-[1.14]"
              }`}
              loading="lazy"
            />
            {hasHoverImage && (
              <Image
                src={hoverImage}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain scale-[1.1] opacity-0 transition-all duration-500 sm:scale-[1.08] max-md:hidden md:group-hover:opacity-100 md:group-hover:scale-[1.14]"
                loading="lazy"
              />
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}

        <div className="absolute inset-0 hidden md:flex bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
          <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1.5 text-white text-xs font-bold uppercase tracking-wider shadow-md">
            <Maximize2 className="h-3.5 w-3.5" />
            Inspect
          </span>
        </div>

        {vehicle.id > 212 && (
          <div className="absolute top-2 left-2 z-10">
            <CardTag className="border-blue-400/30 bg-blue-600/90 text-white backdrop-blur-sm">
              New
            </CardTag>
          </div>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(vehicle.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 rounded-full border p-2 backdrop-blur-md transition-all active:scale-90 sm:top-3 sm:right-3 ${
            isFavorite
              ? "border-red-400/40 bg-red-500/25 text-red-500 shadow-sm"
              : "border-border/60 bg-background/80 text-muted-foreground shadow-sm"
          }`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="px-3 pb-3 pt-2 sm:px-3.5 sm:pb-3.5 sm:pt-2.5">
        <div className="mb-1.5 flex flex-wrap items-center gap-1">
          <CardTag className={`max-w-full border ${seriesStyle}`}>{vehicle.series}</CardTag>
          {vehicle.code && (
            <CardTag className="border-border/70 bg-muted/50 font-mono normal-case tracking-normal text-muted-foreground">
              {vehicle.code}
            </CardTag>
          )}
          <CardTag
            className={
              vehicle.available
                ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "border-red-400/30 bg-red-500/15 text-red-700 dark:text-red-300"
            }
          >
            {vehicle.available ? "In stock" : "Sold out"}
          </CardTag>
        </div>
        <h3 className="font-semibold text-xs leading-snug text-foreground line-clamp-2 sm:text-sm md:group-hover:text-orange-500 md:transition-colors">
          {vehicle.name}
        </h3>
      </div>
    </article>
  );
}

export default memo(VehicleCard);

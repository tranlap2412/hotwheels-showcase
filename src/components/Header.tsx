"use client";

import React from "react";
import { Search, Flame, Heart, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  activeCategory: string;
  setActiveCategory: (val: string) => void;
  categories: string[];
  showOnlyFavorites: boolean;
  setShowOnlyFavorites: (val: boolean) => void;
}

export default function Header({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  categories,
  showOnlyFavorites,
  setShowOnlyFavorites,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-xl supports-backdrop-filter:bg-background/80">
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-4 lg:px-8">
        {/* Row 1: brand + actions (mobile) / brand + search + actions (desktop) */}
        <div className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-4">
          <div className="flex items-center justify-between gap-2 md:justify-start md:shrink-0">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 shadow-md shadow-orange-500/20 sm:h-10 sm:w-10 sm:rounded-xl">
                <Flame className="h-4 w-4 text-white sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="truncate text-base font-extrabold tracking-wide uppercase sm:text-2xl">
                  <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 bg-clip-text text-transparent">
                    Hot Wheels
                  </span>
                </h1>
                <p className="hidden text-[11px] font-medium tracking-[0.2em] text-muted-foreground uppercase sm:block">
                  Premium Showcase
                </p>
              </div>
            </div>

            {/* Mobile-only quick actions */}
            <div className="flex shrink-0 items-center gap-1.5 md:hidden">
              <ThemeToggle className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/80 bg-card/80 active:bg-accent" />
              <button
                type="button"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg border active:scale-95 ${
                  showOnlyFavorites
                    ? "bg-red-500/15 border-red-500/40 text-red-500"
                    : "bg-card/80 border-border/80 text-foreground"
                }`}
                title="Favorites"
              >
                <Heart className={`h-4 w-4 ${showOnlyFavorites ? "fill-current" : ""}`} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
            </span>
            <Input
              type="search"
              enterKeyHint="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search model, code..."
              className="h-9 pl-8 pr-8 text-sm rounded-lg bg-card/80 border-border/80 placeholder:text-muted-foreground/70 focus-visible:ring-orange-500/40 sm:h-10 sm:pl-9 sm:pr-9 sm:rounded-xl"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground active:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-2 md:flex">
            <ThemeToggle className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/80 bg-card/80 hover:bg-accent" />
            <button
              type="button"
              onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
              className={`flex h-10 items-center gap-2 rounded-xl border px-3 transition-all ${
                showOnlyFavorites
                  ? "bg-red-500/15 border-red-500/40 text-red-500 dark:text-red-400"
                  : "bg-card/80 border-border/80 text-foreground hover:bg-accent"
              }`}
            >
              <Heart className={`h-4 w-4 ${showOnlyFavorites ? "fill-current" : ""}`} />
              <span className="text-xs font-semibold">Favorites</span>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-2.5 sm:mt-3.5">
          <div
            className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-3 px-3 scrollbar-none sm:mx-0 sm:px-0 sm:gap-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setActiveCategory(category);
                  if (showOnlyFavorites) setShowOnlyFavorites(false);
                }}
                className={`whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide border transition-all active:scale-95 sm:px-3.5 sm:py-1.5 sm:text-[11px] ${
                  activeCategory === category && !showOnlyFavorites
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white border-transparent shadow-md shadow-orange-500/20"
                    : "bg-card/70 border-border/80 text-muted-foreground"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useDeferredValue,
} from "react";
import dynamic from "next/dynamic";
import { Sparkles, Trash2, ArrowUp, RefreshCw } from "lucide-react";
import Header from "../components/Header";
import VehicleCard, { Vehicle } from "../components/VehicleCard";
import rawVehicles from "../data/vehicles_v2.json";

const DetailModal = dynamic(() => import("../components/DetailModal"), {
  ssr: false,
});

const vehiclesList = rawVehicles as Vehicle[];
const ITEMS_PER_PAGE = 24;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const deferredSearchTerm = useDeferredValue(searchTerm);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hotwheels_favorites");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load favorites", e);
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setShowScrollTop(window.scrollY > 400);
          ticking = false;
        });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const favoritesSet = useMemo(() => new Set(favorites), [favorites]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(vehiclesList.map((v) => v.series)));
    return ["All", ...unique.sort()];
  }, []);

  const filteredAndSortedVehicles = useMemo(() => {
    const query = deferredSearchTerm.toLowerCase();

    const filtered = vehiclesList.filter((vehicle) => {
      if (showOnlyFavorites && !favoritesSet.has(vehicle.id)) {
        return false;
      }
      if (activeCategory !== "All" && !showOnlyFavorites && vehicle.series !== activeCategory) {
        return false;
      }
      if (query) {
        const nameMatch = vehicle.name.toLowerCase().includes(query);
        const originalNameMatch = vehicle.original_title
          ? vehicle.original_title.toLowerCase().includes(query)
          : false;
        const codeMatch = vehicle.code ? vehicle.code.toLowerCase().includes(query) : false;
        const seriesMatch = vehicle.series.toLowerCase().includes(query);
        const handleMatch = vehicle.handle ? vehicle.handle.toLowerCase().includes(query) : false;
        return nameMatch || originalNameMatch || codeMatch || seriesMatch || handleMatch;
      }
      return true;
    });

    return filtered.sort((a, b) => b.id - a.id);
  }, [deferredSearchTerm, activeCategory, showOnlyFavorites, favoritesSet]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [deferredSearchTerm, activeCategory, showOnlyFavorites]);

  const paginatedVehicles = useMemo(
    () => filteredAndSortedVehicles.slice(0, visibleCount),
    [filteredAndSortedVehicles, visibleCount],
  );

  const handleToggleFavorite = useCallback(
    async (id: number) => {
      const isAdding = !favoritesSet.has(id);
      const updated = isAdding
        ? [...favorites, id]
        : favorites.filter((favId) => favId !== id);

      setFavorites(updated);
      localStorage.setItem("hotwheels_favorites", JSON.stringify(updated));

      if (isAdding) {
        const { default: confetti } = await import("canvas-confetti");
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#ff4500", "#ffaa00", "#ffffff"],
        });
      }
    },
    [favorites, favoritesSet],
  );

  const handleClearFavorites = useCallback(() => {
    if (confirm("Are you sure you want to clear all your favorites?")) {
      setFavorites([]);
      localStorage.removeItem("hotwheels_favorites");
      setShowOnlyFavorites(false);
    }
  }, []);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setActiveCategory("All");
    setShowOnlyFavorites(false);
  }, []);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const hasActiveFilters =
    searchTerm || activeCategory !== "All" || showOnlyFavorites;

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background text-foreground">
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        showOnlyFavorites={showOnlyFavorites}
        setShowOnlyFavorites={setShowOnlyFavorites}
      />

      <main className="flex-1 mx-auto max-w-7xl w-full px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
        {hasActiveFilters && (
          <div className="mb-3 flex flex-wrap items-center gap-2 sm:mb-5">
            {showOnlyFavorites && (
              <span className="inline-flex items-center rounded-full bg-red-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-500 sm:text-[11px]">
                Favorites
              </span>
            )}
            {activeCategory !== "All" && !showOnlyFavorites && (
              <span className="inline-flex max-w-[140px] truncate items-center rounded-full bg-orange-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-500 sm:max-w-none sm:text-[11px]">
                {activeCategory}
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex max-w-[160px] truncate items-center rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground sm:max-w-xs sm:text-[11px]">
                &ldquo;{searchTerm}&rdquo;
              </span>
            )}
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 rounded-full border border-border/70 px-2.5 py-1 text-[10px] font-medium text-muted-foreground transition-colors active:bg-accent sm:text-[11px]"
            >
              <RefreshCw className="h-3 w-3" />
              Clear all
            </button>
            {showOnlyFavorites && favorites.length > 0 && (
              <button
                type="button"
                onClick={handleClearFavorites}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium text-red-500/80 transition-colors active:text-red-500 sm:text-[11px]"
              >
                <Trash2 className="h-3 w-3" />
                Empty favorites
              </button>
            )}
          </div>
        )}

        {filteredAndSortedVehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center sm:py-24">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-card border border-border text-muted-foreground shadow-sm">
              <Sparkles className="h-8 w-8 text-muted-foreground/60" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">No matches found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Try adjusting your search terms or filter checks.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 font-bold text-sm text-white shadow-lg shadow-orange-500/15 cursor-pointer hover:brightness-110 transition-all"
            >
              Clear Search & Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {paginatedVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isFavorite={favoritesSet.has(vehicle.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelect={setSelectedVehicle}
              />
            ))}
          </div>
        )}

        {visibleCount < filteredAndSortedVehicles.length && (
          <div className="mt-6 flex justify-center sm:mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              className="w-full max-w-xs px-6 py-2.5 rounded-xl border border-border/70 bg-card/80 font-semibold text-xs text-foreground active:bg-accent sm:w-auto sm:max-w-none sm:px-8 sm:py-3 sm:rounded-2xl sm:text-sm"
            >
              Load more
            </button>
          </div>
        )}
      </main>

      <footer className="mt-10 border-t border-border/60 bg-card/20 px-4 py-6 text-center safe-bottom sm:mt-14 sm:py-8">
        <p className="text-sm font-semibold tracking-wide text-foreground/90">
          Hot Wheels Premium Showcase
        </p>
        <p className="mt-1.5 text-xs text-muted-foreground">
          William Bond · © 2026
        </p>
        <p className="mx-auto mt-2 max-w-xs text-[11px] leading-relaxed text-muted-foreground/65 sm:max-w-sm">
          A personal fan gallery for die-cast collectors. Not affiliated with Mattel.
        </p>
      </footer>

      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          className="fixed z-40 flex h-10 w-10 items-center justify-center rounded-full bg-orange-600 text-white shadow-lg shadow-orange-500/25 active:scale-95 safe-fab sm:bottom-6 sm:right-6 sm:h-11 sm:w-11 sm:hover:bg-orange-500 sm:hover:scale-105 sm:transition-all"
          title="Scroll to top"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
      )}

      <DetailModal
        vehicle={selectedVehicle}
        onClose={() => setSelectedVehicle(null)}
        isFavorite={selectedVehicle ? favoritesSet.has(selectedVehicle.id) : false}
        onToggleFavorite={handleToggleFavorite}
      />
    </div>
  );
}

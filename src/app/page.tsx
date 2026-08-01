"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import SearchAndFilters from "@/components/SearchAndFilters";
import JerseyCard from "@/components/JerseyCard";
import JerseyModal from "@/components/JerseyModal";
import type { Jersey } from "@/types/jersey";
import { useCatalogTheme } from "@/hooks/useCatalogTheme";
import jerseysData from "@/data/jerseys.json";
import { FolderHeart, RefreshCw, Sparkles, Award } from "lucide-react";

export default function Home() {
  const { isDark, toggleTheme } = useCatalogTheme();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jerseys, setJerseys] = useState<Jersey[]>(jerseysData as Jersey[]);

  const catalogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCurrent = true;

    fetch("/api/jerseys")
      .then((response) => {
        if (!response.ok) throw new Error("No se pudo actualizar el catálogo.");
        return response.json() as Promise<Jersey[]>;
      })
      .then((data) => {
        if (isCurrent) setJerseys(data);
      })
      .catch(() => undefined);

    return () => {
      isCurrent = false;
    };
  }, []);

  // Scroll to catalog section
  const handleExploreClick = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Open featured jersey details (Mexico jersey id: 'mexico-2024')
  const handleFeaturedViewClick = () => {
    const featured = jerseys.find((j) => j.id === "mexico-2024");
    if (featured) {
      setSelectedJersey(featured);
      setIsModalOpen(true);
    }
  };

  const handleViewDetails = (jersey: Jersey) => {
    setSelectedJersey(jersey);
    setIsModalOpen(true);
  };

  // Filter and search logic
  const filteredJerseys = useMemo(() => {
    return jerseys
      .filter((jersey) => {
        // Category filter
        if (activeCategory !== "all" && jersey.category !== activeCategory) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase();
          const matchesTeam = jersey.team.toLowerCase().includes(query);
          const matchesBrand = jersey.brand.toLowerCase().includes(query);
          const matchesSeason = jersey.season.toLowerCase().includes(query);
          const matchesSub = jersey.subcategory.toLowerCase().includes(query);
          const matchesType = jersey.type.toLowerCase().includes(query);
          const matchesDesc = jersey.description.toLowerCase().includes(query);

          return matchesTeam || matchesBrand || matchesSeason || matchesSub || matchesType || matchesDesc;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") {
          return a.team.localeCompare(b.team);
        } else if (sortBy === "name-desc") {
          return b.team.localeCompare(a.team);
        } else if (sortBy === "season-desc") {
          // Compare strings like "2024/25" or "2000/01" (newest first)
          return b.season.localeCompare(a.season);
        } else if (sortBy === "season-asc") {
          return a.season.localeCompare(b.season);
        }
        return 0;
      });
  }, [activeCategory, searchQuery, sortBy, jerseys]);

  const resetFilters = () => {
    setActiveCategory("all");
    setSearchQuery("");
    setSortBy("name-asc");
  };

  return (
    <div className={`${isDark ? "dark" : ""} min-h-screen bg-white text-black flex flex-col justify-between transition-colors duration-300 dark:bg-[#090b0a] dark:text-white motion-reduce:transition-none`}>
      <div>
        {/* Navigation Header */}
        <Header
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          isDark={isDark}
          onThemeToggle={toggleTheme}
        />

        {/* Hero Section */}
        <HeroBanner
          onExploreClick={handleExploreClick}
          onFeaturedViewClick={handleFeaturedViewClick}
        />

        {/* Catalog Section */}
        <div ref={catalogRef} className="scroll-mt-20">
          <SearchAndFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />

          {/* Grid Layout */}
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
            {filteredJerseys.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredJerseys.map((jersey) => (
                  <JerseyCard
                    key={jersey.id}
                    jersey={jersey}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 py-16 px-4 text-center max-w-lg mx-auto my-10 space-y-4 dark:border-white/15">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 border border-gray-150 text-gray-400 dark:border-white/10 dark:bg-white/[.06]">
                  <FolderHeart className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Sin playeras encontradas</h3>
                  <p className="text-xs text-gray-500 font-light max-w-xs dark:text-white/50">
                    No pudimos encontrar ninguna pieza que coincida con tus filtros de búsqueda actuales.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-black px-4 py-2 text-xs font-bold text-white transition hover:scale-102 active:scale-98 shadow-sm dark:bg-emerald-500 dark:text-[#07110d]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Restaurar Filtros
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50/50 py-10 mt-16 transition-colors dark:border-white/10 dark:bg-[#0c100e]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left Brand */}
            <div className="text-center md:text-left space-y-1">
              <span className="text-sm font-black uppercase tracking-wider text-black dark:text-white">
                Jersey<span className="text-emerald-600">Vault</span>
              </span>
              <p className="text-xs text-gray-400 font-light dark:text-white/40">
                © {new Date().getFullYear()} Diego&apos;s Collection. Diseñado para coleccionistas apasionados.
              </p>
            </div>

            {/* Right Meta details */}
            <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-gray-400 dark:text-white/45">
              <span className="flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-emerald-500" />
                Autenticidad 100%
              </span>
              <span className="text-gray-200 dark:text-white/15">•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                Galería Ultra HD
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Product View Modal */}
      <JerseyModal
        key={selectedJersey?.id ?? "closed"}
        jersey={selectedJersey}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

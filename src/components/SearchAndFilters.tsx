"use client";

import React from "react";
import { Search, SlidersHorizontal, ArrowUpDown } from "lucide-react";

interface SearchAndFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

export default function SearchAndFilters({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
}: SearchAndFiltersProps) {
  const categories = [
    { id: "all", name: "Todas las piezas" },
    { id: "Selecciones Nacionales", name: "Selecciones" },
    { id: "Fútbol MX", name: "Fútbol MX" },
    { id: "Europa", name: "Europa" },
    { id: "Otros", name: "Otros Equipos" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6 py-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por equipo, marca, temporada..."
            className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-black placeholder-gray-400 transition shadow-sm hover:border-gray-300 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        {/* Sort drop down */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500">
            <ArrowUpDown className="h-4 w-4" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm font-semibold text-black transition shadow-sm hover:border-gray-300 focus:border-black focus:outline-none"
          >
            <option value="name-asc">Equipo (A - Z)</option>
            <option value="name-desc">Equipo (Z - A)</option>
            <option value="season-desc">Temporada (Más Reciente)</option>
            <option value="season-asc">Temporada (Antiguas Primero)</option>
          </select>
        </div>
      </div>

      {/* Category Horizontal Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-500 flex-shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
        </div>
        <div className="flex space-x-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeCategory === cat.id
                  ? "bg-black text-white shadow-md scale-102"
                  : "bg-gray-50 text-gray-600 border border-gray-200/50 hover:bg-gray-100 hover:text-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

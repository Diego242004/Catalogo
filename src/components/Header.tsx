"use client";

import React from "react";
import Link from "next/link";
import { Moon, Plus, Sun, Trophy } from "lucide-react";

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
}

export default function Header({ activeCategory, setActiveCategory, isDark, onThemeToggle }: HeaderProps) {
  const categories = [
    { id: "all", name: "Todos" },
    { id: "Selecciones Nacionales", name: "Selecciones" },
    { id: "Fútbol MX", name: "Fútbol MX" },
    { id: "Europa", name: "Europa" },
    { id: "Otros", name: "Otros" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/75 backdrop-blur-md transition-colors dark:border-white/10 dark:bg-[#090b0a]/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveCategory("all")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm transition hover:scale-105">
            <Trophy className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-black uppercase dark:text-white">
              Jersey<span className="text-emerald-600">Vault</span>
            </span>
            <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase leading-none">
              Colección Privada
            </p>
          </div>
        </div>

        {/* Navigation Categories */}
        <nav className="hidden md:flex space-x-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                (cat.id === "all" && activeCategory === "all") || activeCategory === cat.id
                  ? "bg-black text-white shadow-sm dark:bg-emerald-500 dark:text-[#07110d]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black dark:text-white/55 dark:hover:bg-white/[.07] dark:hover:text-white"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Admin action and collection badge */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            onClick={onThemeToggle}
            className="group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:border-white/12 dark:bg-white/[.07] dark:focus-visible:ring-offset-[#090b0a]"
          >
            <span className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 motion-reduce:transition-none ${isDark ? "translate-x-8 bg-emerald-500 text-[#07110d]" : "translate-x-0 bg-white text-amber-500 shadow-sm"}`}>
              {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </span>
            <span className="sr-only">{isDark ? "Modo oscuro activo" : "Modo claro activo"}</span>
            <span aria-hidden="true" className="w-8" />
          </button>
          <Link
            href="/admin/agregar"
            className="inline-flex items-center gap-1.5 rounded-full bg-black px-3.5 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 dark:bg-white/10 dark:hover:bg-emerald-500 dark:hover:text-[#07110d]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Agregar</span>
          </Link>
          <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-100/50 lg:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Exhibición Online
          </div>
        </div>
      </div>
    </header>
  );
}

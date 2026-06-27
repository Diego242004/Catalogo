"use client";

import React from "react";
import { ShieldAlert, Trophy } from "lucide-react";

interface HeaderProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export default function Header({ activeCategory, setActiveCategory }: HeaderProps) {
  const categories = [
    { id: "all", name: "Todos" },
    { id: "Selecciones Nacionales", name: "Selecciones" },
    { id: "Fútbol MX", name: "Fútbol MX" },
    { id: "Europa", name: "Europa" },
    { id: "Otros", name: "Otros" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveCategory("all")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white shadow-sm transition hover:scale-105">
            <Trophy className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-black uppercase">
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
                  ? "bg-black text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-black"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </nav>

        {/* Collection Badge */}
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-100/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          Exhibición Online
        </div>
      </div>
    </header>
  );
}

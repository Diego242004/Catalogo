"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Sparkles, Award } from "lucide-react";

interface HeroBannerProps {
  onExploreClick: () => void;
  onFeaturedViewClick: () => void;
}

export default function HeroBanner({ onExploreClick, onFeaturedViewClick }: HeroBannerProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-emerald-950 text-white rounded-3xl mx-4 my-6 sm:mx-6 lg:mx-8 shadow-xl">
      {/* Decorative Grid Patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute right-10 bottom-10 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-12 lg:px-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1 text-xs font-semibold tracking-wide text-emerald-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Colección 2026
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
              EL ARTE DE LA <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                CAMISETA DE FÚTBOL
              </span>
            </h1>

            <p className="max-w-xl text-sm sm:text-base text-gray-300 font-light leading-relaxed mx-auto lg:mx-0">
              Explora una selección exclusiva de playeras de fútbol históricas y modernas. Desde tesoros vintage hasta las equipaciones oficiales más recientes, cada una con su ficha técnica y galería en alta definición.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-black transition-all hover:bg-emerald-500 hover:text-white hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                Ver Catálogo
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onFeaturedViewClick}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-bold text-white transition-all hover:bg-white/10 hover:border-white/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Destacada de la Semana
              </button>
            </div>
          </div>

          {/* Featured Product Floating Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="group relative w-72 sm:w-80 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/10 hover:scale-[1.03] shadow-2xl">
              {/* Product Badge */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1 rounded-md bg-emerald-500 px-2 py-0.5 text-[10px] font-black text-black uppercase tracking-wider">
                <Award className="h-3 w-3" />
                Dri-Fit ADV
              </div>

              {/* Floating Image Container */}
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-white/5 transition duration-500 group-hover:scale-105 flex items-center justify-center p-4">
                <Image
                  src="images/mexico.png"
                  alt="Featured Jersey"
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                  className="object-contain p-2 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition duration-500 group-hover:-rotate-3"
                />
              </div>

              {/* Card Meta */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Selección Mexicana</span>
                  <span className="font-semibold text-emerald-400">2025/26</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="font-extrabold text-white text-lg tracking-tight">Edición Local</h3>
                  <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Adidas</span>
                </div>
                <p className="text-xs text-gray-300 font-light line-clamp-1">
                  Patrón detallado inspirado en el calendario azteca.
                </p>
                <div className="pt-2">
                  <button
                    onClick={onFeaturedViewClick}
                    className="w-full text-center py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition duration-200"
                  >
                    Detalles de la Prenda
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

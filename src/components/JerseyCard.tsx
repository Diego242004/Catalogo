"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Jersey } from "@/types/jersey";

export type { Jersey } from "@/types/jersey";

interface JerseyCardProps {
  jersey: Jersey;
  onViewDetails: (jersey: Jersey) => void;
}

export default function JerseyCard({ jersey, onViewDetails }: JerseyCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === jersey.images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? jersey.images.length - 1 : prev - 1));
  };

  // Color matching based on jersey version
  const getVersionColor = (version: Jersey["version"]) => {
    switch (version) {
      case "Versión Fan":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-400/10 dark:text-blue-300 dark:border-blue-400/25";
      case "Versión Jugador":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-400/10 dark:text-red-300 dark:border-red-400/25";
      case "Versión Equipo":
        return "bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-400/10 dark:text-yellow-300 dark:border-yellow-400/25";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-white/60 dark:border-white/10";
    }
  };

  return (
    <div
      onClick={() => onViewDetails(jersey)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer flex flex-col justify-between overflow-hidden rounded-2xl bg-white border border-gray-150 transition-all duration-300 hover:shadow-lg hover:border-gray-300 dark:border-white/10 dark:bg-[#111512] dark:hover:border-emerald-400/30 dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
    >
      {/* Product Image and Carousel Controls */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-50 p-6 flex items-center justify-center dark:bg-[#151a17]">
        {jersey.soldOut && (
          <span className="absolute left-0 top-4 z-20 bg-black px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-white shadow-md dark:bg-white dark:text-black">
            Agotado
          </span>
        )}
        {/* Main image */}
        <div className="relative h-full w-full transition duration-500 group-hover:scale-105">
          <Image
            src={jersey.images[currentImageIndex]}
            alt={`${jersey.team} - Image ${currentImageIndex + 1}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            className="object-contain p-2 filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          />
        </div>

        {/* Carousel overlay arrows */}
        <div
          className={`absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <button
            onClick={prevImage}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-100 text-black hover:bg-white transition-all active:scale-95 dark:border-white/10 dark:bg-[#0b0e0c]/90 dark:text-white dark:hover:bg-emerald-400 dark:hover:text-black"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={nextImage}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-md border border-gray-100 text-black hover:bg-white transition-all active:scale-95 dark:border-white/10 dark:bg-[#0b0e0c]/90 dark:text-white dark:hover:bg-emerald-400 dark:hover:text-black"
            aria-label="Next image"
          >
            <ChevronRight className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
          {jersey.images.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentImageIndex ? "w-4 bg-black dark:bg-emerald-400" : "w-1.5 bg-gray-300 dark:bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Brand Tag Top Left */}
        <span className="absolute top-3 left-3 rounded-md bg-black px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-wider dark:bg-white dark:text-black">
          {jersey.brand}
        </span>

        {/* Version Badge Top Right */}
        <span
          className={`absolute top-3 right-3 rounded-md px-2 py-0.5 text-[9px] font-bold border ${getVersionColor(
            jersey.version
          )}`}
        >
          {jersey.version}
        </span>
      </div>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 justify-between space-y-3 bg-white dark:bg-[#111512]">
        <div className="space-y-1">
          {/* Subcategory & Season */}
          <div className="flex items-center justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider dark:text-white/40">
            <span>{jersey.subcategory}</span>
            <span className="text-emerald-600 font-extrabold dark:text-emerald-400">{jersey.season}</span>
          </div>

          {/* Title / Name */}
          <h3 className="font-extrabold text-gray-900 text-base leading-tight group-hover:text-emerald-700 transition duration-150 dark:text-white dark:group-hover:text-emerald-300">
            {jersey.team}
          </h3>

          {/* Type tag */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 dark:text-white/50">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>{jersey.type}</span>
            <span className="mx-1 text-gray-300">•</span>
            <span>Talla {jersey.size}</span>
          </div>

          {/* Short description */}
          <p className="text-xs text-gray-500 line-clamp-2 pt-1 font-light leading-relaxed dark:text-white/45">
            {jersey.description}
          </p>
        </div>

        {/* View Details Button */}
        <div className="pt-2 border-t border-gray-50 dark:border-white/10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(jersey);
            }}
            className="w-full text-center py-2.5 rounded-xl bg-gray-50 hover:bg-black hover:text-white text-black text-xs font-bold transition-all duration-300 border border-gray-200/60 hover:border-black active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.055] dark:text-white dark:hover:border-emerald-400 dark:hover:bg-emerald-400 dark:hover:text-[#07110c]"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
}

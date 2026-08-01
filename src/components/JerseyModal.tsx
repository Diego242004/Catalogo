"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Award, AlertCircle, Calendar, Tag, Shield, ShieldCheck } from "lucide-react";
import type { Jersey } from "@/types/jersey";

interface JerseyModalProps {
  jersey: Jersey | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function JerseyModal({ jersey, isOpen, onClose }: JerseyModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Disable scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen || !jersey) return null;

  const getVersionStyle = (version: Jersey["version"]) => {
    switch (version) {
      case "Versión Fan":
        return {
          bg: "bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-400/10 dark:text-blue-200 dark:border-blue-400/25",
          desc: "Versión pensada para aficionados, con un ajuste cómodo ideal para uso cotidiano.",
        };
      case "Versión Jugador":
        return {
          bg: "bg-red-50 text-red-800 border-red-200 dark:bg-red-400/10 dark:text-red-200 dark:border-red-400/25",
          desc: "Versión de alto rendimiento con corte atlético y tecnología similar a la utilizada por los jugadores.",
        };
      case "Versión Equipo":
        return {
          bg: "bg-yellow-50 text-yellow-900 border-yellow-300 dark:bg-yellow-400/10 dark:text-yellow-200 dark:border-yellow-400/25",
          desc: "Versión con especificaciones de equipo, detalles premium y acabados de nivel profesional.",
        };
      default:
        return {
          bg: "bg-gray-50 text-gray-800 border-gray-200 dark:bg-white/5 dark:text-white/70 dark:border-white/10",
          desc: "Versión de jersey sin especificaciones adicionales.",
        };
    }
  };

  const versionStyle = getVersionStyle(jersey.version);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Background Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 dark:bg-black/80"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] md:max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 dark:border dark:border-white/10 dark:bg-[#101411]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-black shadow-sm transition hover:bg-black hover:text-white dark:border-white/10 dark:bg-[#171c19]/90 dark:text-white dark:hover:bg-emerald-400 dark:hover:text-black"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 bg-gray-50 p-6 sm:p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-150 dark:border-white/10 dark:bg-[#0b0e0c]">
              {/* Main Image View */}
              <div className="relative aspect-square w-full flex items-center justify-center rounded-2xl bg-white p-4 sm:p-8 border border-gray-100 shadow-sm dark:border-white/10 dark:bg-[#151a17] dark:shadow-none">
                <Image
                  src={jersey.images[activeImageIndex]}
                  alt={`${jersey.team} view`}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  priority
                  className="object-contain p-2 filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
                />
              </div>

              {/* Thumbnail Selectors */}
              <div className="flex justify-center gap-3 mt-6">
                {jersey.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-16 w-16 overflow-hidden rounded-xl border-2 transition-all p-1 bg-white hover:scale-105 dark:bg-[#151a17] ${
                      idx === activeImageIndex
                        ? "border-black shadow-md scale-102 dark:border-emerald-400"
                        : "border-gray-200 opacity-60 hover:opacity-100 dark:border-white/10"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-contain p-1"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Specifications */}
            <div className="lg:col-span-6 p-6 sm:p-8 space-y-6 dark:bg-[#101411]">
              {/* Category & Title */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 dark:bg-white/[0.07] dark:text-white/60">
                    {jersey.category}
                  </span>
                  <span className="text-xs text-gray-400 font-medium dark:text-white/35">/ {jersey.subcategory}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight dark:text-white">
                  {jersey.team}
                </h2>
                <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider dark:text-white/35">
                  Colección {jersey.brand}
                </p>
              </div>

              {/* Custom Badges/Highlights */}
              <div className="flex flex-wrap gap-1.5">
                {jersey.highlights.map((hl, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300"
                  >
                    <Award className="h-3 w-3 text-emerald-600" />
                    {hl}
                  </span>
                ))}
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-150 p-4 bg-gray-50/50 dark:border-white/10 dark:bg-white/[0.035]">
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4.5 w-4.5 text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Temporada</p>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-white">{jersey.season}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Tag className="h-4.5 w-4.5 text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Talla</p>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-white">Talla {jersey.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Shield className="h-4.5 w-4.5 text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tipo</p>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-white">{jersey.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="h-4.5 w-4.5 text-gray-400" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Marca</p>
                    <p className="text-sm font-extrabold text-gray-800 dark:text-white">{jersey.brand}</p>
                  </div>
                </div>
              </div>

              {/* Version box */}
              <div className={`rounded-2xl border p-4 space-y-1.5 ${versionStyle.bg}`}>
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="h-4.5 w-4.5" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    {jersey.version}
                  </span>
                </div>
                <p className="text-xs font-light leading-relaxed">{versionStyle.desc}</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-extrabold text-gray-800 tracking-wider dark:text-white">Historia & Detalles</h4>
                <p className="text-sm text-gray-600 leading-relaxed font-light dark:text-white/55">
                  {jersey.details}
                </p>
              </div>

              {/* Observations */}
              {jersey.observations && (
                <div className="border-t border-gray-100 pt-4 space-y-1.5 dark:border-white/10">
                  <h4 className="text-xs uppercase font-extrabold text-gray-400 tracking-wider">Observaciones de Colección</h4>
                  <p className="text-xs text-gray-500 italic font-light leading-relaxed dark:text-white/45">
                    &ldquo;{jersey.observations}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

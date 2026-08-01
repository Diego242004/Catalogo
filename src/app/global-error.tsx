"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("JerseyVault no pudo completar la carga:", error);
  }, [error]);

  return (
    <html lang="es">
      <body className="m-0 flex min-h-screen items-center justify-center bg-[#090b0a] px-6 font-sans text-white">
        <main className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111512] p-8 text-center shadow-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
            JerseyVault
          </p>
          <h1 className="text-2xl font-black">No pudimos completar la carga</h1>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Reintentaremos cargar el catálogo sin perder tus datos ni tu sesión.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 w-full rounded-xl bg-emerald-400 px-4 py-3 text-sm font-black text-[#07110c] transition hover:bg-emerald-300"
          >
            Reintentar
          </button>
          <Link href="/" className="mt-4 inline-block text-xs font-semibold text-white/45 hover:text-white">
            Volver al inicio
          </Link>
        </main>
      </body>
    </html>
  );
}

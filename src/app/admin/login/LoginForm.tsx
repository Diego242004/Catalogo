"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeft, Eye, EyeOff, KeyRound, LoaderCircle, LockKeyhole, Trophy } from "lucide-react";

export default function LoginForm() {
  const router = useRouter();
  const [accessKey, setAccessKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "No se pudo iniciar sesión.");

      router.replace("/admin/agregar");
      router.refresh();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "No se pudo iniciar sesión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#090b0a] text-white">
      <div aria-hidden="true" className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] [background-size:48px_48px]" />
      <div aria-hidden="true" className="absolute -right-28 top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-emerald-500/15 blur-3xl" />
      <div aria-hidden="true" className="absolute bottom-[-12rem] left-[-12rem] h-[30rem] w-[30rem] rounded-full bg-emerald-900/20 blur-3xl" />

      <div className="relative mx-auto grid min-h-dvh max-w-7xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden flex-col justify-between border-r border-white/10 p-12 lg:flex xl:p-16">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-black">
              <Trophy className="h-5 w-5 text-emerald-600" />
            </span>
            <div>
              <p className="text-lg font-black uppercase tracking-tight">Jersey<span className="text-emerald-400">Vault</span></p>
              <p className="text-[10px] font-bold uppercase tracking-[.22em] text-white/40">Colección privada</p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-5 text-xs font-black uppercase tracking-[.28em] text-emerald-400">Acceso de administración</p>
            <p aria-hidden="true" className="text-6xl font-black leading-[.92] tracking-[-.065em] xl:text-8xl">
              LA PUERTA<br />DEL <span className="text-emerald-400">VAULT.</span>
            </p>
            <p className="mt-7 max-w-md text-base leading-7 text-white/50">
              Un espacio reservado para documentar nuevas piezas y mantener viva la colección.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[.2em] text-white/30">
            <span>JV / ADMIN</span><span className="h-px w-16 bg-white/15" /><span>Sesión 08H</span>
          </div>
        </section>

        <section className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-10 flex items-center justify-between lg:hidden">
              <div className="flex items-center gap-2 text-sm font-black uppercase">
                <Trophy className="h-5 w-5 text-emerald-400" /> JerseyVault
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[.2em] text-white/35">Admin</span>
            </div>

            <Link href="/" className="mb-10 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-white/50 transition hover:text-white focus-visible:rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400">
              <ArrowLeft className="h-4 w-4" /> Volver al catálogo
            </Link>

            <div className="mb-8">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-400">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <h1 className="text-3xl font-black tracking-[-.035em] sm:text-4xl">Desbloquear administración</h1>
              <p className="mt-3 text-sm leading-6 text-white/45">Ingresa tu clave para agregar nuevas piezas al catálogo.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="access-key" className="mb-2 block text-xs font-black uppercase tracking-[.16em] text-white/60">Clave de acceso</label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" />
                  <input
                    id="access-key"
                    type={showKey ? "text" : "password"}
                    value={accessKey}
                    onChange={(event) => setAccessKey(event.target.value)}
                    autoComplete="current-password"
                    autoFocus
                    required
                    className="h-14 w-full rounded-2xl border border-white/12 bg-white/[.055] pl-12 pr-14 text-base text-white outline-none transition placeholder:text-white/20 hover:border-white/25 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/10"
                    placeholder="Escribe tu clave"
                    aria-describedby={error ? "login-error" : "session-note"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((visible) => !visible)}
                    className="absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-xl text-white/35 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                    aria-label={showKey ? "Ocultar clave" : "Mostrar clave"}
                  >
                    {showKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {error ? <p id="login-error" role="alert" className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 px-3.5 py-3 text-sm font-semibold text-red-200">{error}</p> : null}
                <p id="session-note" className="mt-3 text-xs leading-5 text-white/35">Tu acceso permanecerá activo durante 8 horas en este navegador.</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !accessKey}
                className="flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-5 text-sm font-black text-[#07110d] transition duration-200 hover:bg-emerald-400 active:scale-[.99] disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transform-none"
              >
                {isSubmitting ? <LoaderCircle className="h-5 w-5 animate-spin motion-reduce:animate-none" /> : <LockKeyhole className="h-4.5 w-4.5" />}
                {isSubmitting ? "Verificando..." : "Entrar al panel"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

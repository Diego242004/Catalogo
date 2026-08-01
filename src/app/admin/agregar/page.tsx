"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Save,
  Shirt,
  X,
} from "lucide-react";
import { JERSEY_VERSIONS, type JerseyVersion } from "@/types/jersey";

const categories = ["Selecciones Nacionales", "Fútbol MX", "Europa", "Otros"];
const jerseyTypes = ["Local", "Visitante", "Tercera Equipación", "Entrenamiento", "Edición Especial"];
const sizes = ["S", "M", "L", "XL", "XXL"];

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AddJerseyPage() {
  const router = useRouter();
  const [team, setTeam] = useState("");
  const [season, setSeason] = useState("");
  const [type, setType] = useState("Local");
  const [version, setVersion] = useState<JerseyVersion>("Versión Fan");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [message, setMessage] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const jerseyId = team.trim() && season.trim() ? slugify(`${team}-${type}-${season}`) : "";
  const previewUrls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)), [previewUrls]);

  const toggleSize = (size: string) => {
    setSelectedSizes((current) =>
      current.includes(size) ? current.filter((item) => item !== size) : [...current, size],
    );
  };

  const handleImages = (selectedFiles: FileList | null) => {
    const nextFiles = Array.from(selectedFiles ?? []).slice(0, 5);
    setFiles(nextFiles);
    setMessage(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (selectedSizes.length === 0) {
      setMessage({ kind: "error", text: "Selecciona al menos una talla." });
      return;
    }
    if (files.length === 0) {
      setMessage({ kind: "error", text: "Agrega al menos una imagen." });
      return;
    }

    setIsSaving(true);
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/jerseys", { method: "POST", body: formData });
      const result = (await response.json()) as { error?: string; message?: string };
      if (response.status === 401) {
        router.replace("/admin/login");
        router.refresh();
        return;
      }
      if (!response.ok) throw new Error(result.error ?? "No se pudo guardar el jersey.");

      setMessage({ kind: "success", text: result.message ?? "Jersey agregado correctamente." });
      form.reset();
      setTeam("");
      setSeason("");
      setType("Local");
      setVersion("Versión Fan");
      setSelectedSizes([]);
      setFiles([]);
    } catch (error) {
      setMessage({ kind: "error", text: error instanceof Error ? error.message : "Ocurrió un error." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/");
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black">
            <ArrowLeft className="h-4 w-4" /> Volver al catálogo
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 text-sm font-black uppercase tracking-tight sm:flex">
              <Shirt className="h-5 w-5 text-emerald-600" /> JerseyVault Admin
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-bold text-gray-600 transition hover:border-gray-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoggingOut ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Administración local</span>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Agregar un jersey</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Completa la ficha, revisa la vista previa y guarda la nueva pieza directamente en el catálogo.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-5 text-lg font-black">Información principal</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Equipo o selección">
                  <input name="team" value={team} onChange={(e) => setTeam(e.target.value)} className={inputClass} placeholder="Ej. Real Madrid" required />
                </Field>
                <Field label="Marca">
                  <input name="brand" className={inputClass} placeholder="Ej. Adidas" required />
                </Field>
                <Field label="Categoría">
                  <select name="category" className={inputClass} required>
                    {categories.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="Subcategoría">
                  <input name="subcategory" className={inputClass} placeholder="Ej. La Liga, UEFA, Liga MX" required />
                </Field>
                <Field label="Temporada">
                  <input name="season" value={season} onChange={(e) => setSeason(e.target.value)} className={inputClass} placeholder="Ej. 2025/26" required />
                </Field>
                <Field label="Tipo">
                  <select name="type" value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
                    {jerseyTypes.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="Versión">
                  <select name="version" value={version} onChange={(e) => setVersion(e.target.value as JerseyVersion)} className={inputClass}>
                    {JERSEY_VERSIONS.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </Field>
                <Field label="ID generado automáticamente">
                  <input name="id" value={jerseyId} readOnly className={`${inputClass} bg-gray-50 font-mono text-xs text-gray-500`} placeholder="Se generará al completar los datos" />
                </Field>
              </div>

              <div className="mt-5">
                <span className={labelClass}>Tallas disponibles</span>
                <input type="hidden" name="size" value={selectedSizes.join(",")} />
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const active = selectedSizes.includes(size);
                    return (
                      <button key={size} type="button" onClick={() => toggleSize(size)} aria-pressed={active}
                        className={`h-10 min-w-12 rounded-xl border px-3 text-sm font-black transition ${active ? "border-black bg-black text-white" : "border-gray-200 bg-white text-gray-500 hover:border-gray-400"}`}>
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <h2 className="mb-5 text-lg font-black">Descripción</h2>
              <div className="space-y-5">
                <Field label="Descripción corta">
                  <textarea name="description" className={`${inputClass} min-h-24 resize-y`} maxLength={220} placeholder="Texto breve que aparecerá en la card." required />
                </Field>
                <Field label="Historia y detalles">
                  <textarea name="details" className={`${inputClass} min-h-36 resize-y`} placeholder="Describe el diseño, materiales, contexto o historia de la camiseta." required />
                </Field>
                <Field label="Destacados (separados por comas)">
                  <input name="highlights" className={inputClass} placeholder="Ej. Edición retro, Escudo bordado, Dri-FIT" />
                </Field>
                <Field label="Observaciones">
                  <textarea name="observations" className={`${inputClass} min-h-24 resize-y`} placeholder="Información adicional opcional." />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div><h2 className="text-lg font-black">Imágenes</h2><p className="text-xs text-gray-400">Entre 1 y 5 archivos JPG, PNG o WebP. Máximo 8 MB cada uno.</p></div>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">{files.length}/5</span>
              </div>
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center transition hover:border-emerald-400 hover:bg-emerald-50/40">
                <ImagePlus className="mb-3 h-8 w-8 text-emerald-600" />
                <span className="text-sm font-black">Seleccionar imágenes</span>
                <span className="mt-1 text-xs text-gray-400">La primera imagen será la portada</span>
                <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => handleImages(e.target.files)} />
              </label>
              {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${file.lastModified}`} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                      <Image src={previewUrls[index]} alt={`Vista previa ${index + 1}`} fill unoptimized className="object-contain p-2" />
                      <button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        className="absolute right-1.5 top-1.5 rounded-full bg-black/70 p-1 text-white" aria-label={`Quitar ${file.name}`}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {message && (
              <div role="status" className={`flex items-center gap-2 rounded-2xl border p-4 text-sm font-bold ${message.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
                {message.kind === "success" ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}{message.text}
              </div>
            )}

            <button type="submit" disabled={isSaving} className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-black px-6 py-4 text-sm font-black text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSaving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isSaving ? "Guardando..." : "Guardar jersey en el catálogo"}
            </button>
          </div>

          <aside className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-black uppercase tracking-wider">Vista previa</h2><span className="text-[10px] font-bold uppercase text-gray-400">Card</span></div>
            <div className="overflow-hidden rounded-2xl border border-gray-200">
              <div className="relative flex aspect-square items-center justify-center bg-gray-50 p-6">
                {previewUrls[0] ? <Image src={previewUrls[0]} alt="Portada del jersey" fill unoptimized className="object-contain p-8" /> : <Shirt className="h-20 w-20 text-gray-200" />}
                <span className="absolute left-3 top-3 rounded-md bg-black px-2 py-1 text-[9px] font-black uppercase text-white">Marca</span>
                <VersionBadge version={version} />
              </div>
              <div className="space-y-2 p-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400"><span>Subcategoría</span><span className="text-emerald-600">{season || "Temporada"}</span></div>
                <h3 className="text-lg font-black">{team || "Nombre del equipo"}</h3>
                <p className="text-xs font-bold text-gray-500">{type} · Talla {selectedSizes.join(",") || "—"}</p>
                <div className="mt-4 rounded-xl bg-gray-50 py-2.5 text-center text-xs font-black">Ver Detalles</div>
              </div>
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
              Acceso protegido. Tu sesión se cerrará automáticamente después de 8 horas.
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label><span className={labelClass}>{label}</span>{children}</label>;
}

function VersionBadge({ version }: { version: JerseyVersion }) {
  const colors: Record<JerseyVersion, string> = {
    "Versión Fan": "border-blue-200 bg-blue-50 text-blue-700",
    "Versión Jugador": "border-red-200 bg-red-50 text-red-700",
    "Versión Equipo": "border-yellow-300 bg-yellow-50 text-yellow-800",
  };
  return <span className={`absolute right-3 top-3 rounded-md border px-2 py-1 text-[9px] font-bold ${colors[version]}`}>{version}</span>;
}

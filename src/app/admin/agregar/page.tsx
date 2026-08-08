"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, LoaderCircle, LogOut, PackageCheck, Pencil, Plus, Save, Shirt, Trash2, Upload, X } from "lucide-react";
import { JERSEY_VERSIONS, type Jersey, type JerseyVersion } from "@/types/jersey";

type Tab = "add" | "update" | "delete";
type Notice = { kind: "success" | "error"; text: string } | null;
const categories = ["Selecciones Nacionales", "Fútbol MX", "Europa", "Otros"];
const jerseyTypes = ["Local", "Visitante", "Tercera Equipación", "Entrenamiento", "Edición Especial"];
const sizes = ["S", "M", "L", "XL", "XXL"];
const inputClass = "min-h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-300 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100";
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500";

function slugify(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminJerseysPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("add");
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [notice, setNotice] = useState<Notice>(null);

  const loadJerseys = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jerseys", { cache: "no-store" });
      if (!response.ok) throw new Error();
      const data = await response.json() as Jersey[];
      setJerseys(data);
      setSelectedId((current) => data.some((item) => item.id === current) ? current : data[0]?.id ?? "");
    } catch { setNotice({ kind: "error", text: "No se pudo cargar el catálogo." }); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    let active = true;
    fetch("/api/jerseys", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<Jersey[]>;
      })
      .then((data) => {
        if (!active) return;
        setJerseys(data);
        setSelectedId(data[0]?.id ?? "");
      })
      .catch(() => { if (active) setNotice({ kind: "error", text: "No se pudo cargar el catálogo." }); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  const selected = jerseys.find((jersey) => jersey.id === selectedId);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/"); router.refresh();
  };

  return (
    <main className="min-h-dvh bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-gray-600 hover:text-black"><ArrowLeft className="h-4 w-4" /> Volver al catálogo</Link>
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-sm font-black uppercase sm:flex"><Shirt className="h-5 w-5 text-emerald-600" /> JerseyVault Admin</span>
            <button onClick={logout} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-3 text-xs font-bold text-gray-600 hover:border-gray-400 hover:text-black"><LogOut className="h-4 w-4" /> Cerrar sesión</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-7">
          <span className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Administración local</span>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Gestionar jerseys</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">Agrega piezas, actualiza su información y controla cuáles están disponibles.</p>
        </div>

        <nav aria-label="Secciones de administración" className="mb-8 grid rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm sm:inline-grid sm:grid-cols-3">
          <TabButton active={tab === "add"} onClick={() => { setTab("add"); setNotice(null); }} icon={<Plus />} label="Agregar" />
          <TabButton active={tab === "update"} onClick={() => { setTab("update"); setNotice(null); }} icon={<Pencil />} label="Actualizar" />
          <TabButton active={tab === "delete"} onClick={() => { setTab("delete"); setNotice(null); }} icon={<Trash2 />} label="Eliminar" danger />
        </nav>

        {notice && <div aria-live="polite" className={`mb-6 flex items-center gap-2 rounded-2xl border p-4 text-sm font-bold ${notice.kind === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>{notice.kind === "success" ? <CheckCircle2 className="h-5 w-5" /> : <X className="h-5 w-5" />}{notice.text}</div>}

        {tab === "add" && <JerseyForm mode="add" onDone={(message) => { setNotice({ kind: "success", text: message }); void loadJerseys(); }} onError={(text) => setNotice({ kind: "error", text })} />}
        {tab === "update" && <CatalogWorkspace loading={loading} jerseys={jerseys} selectedId={selectedId} onSelect={setSelectedId}>{selected && <JerseyForm key={selected.id} mode="update" jersey={selected} onDone={(message) => { setNotice({ kind: "success", text: message }); void loadJerseys(); }} onError={(text) => setNotice({ kind: "error", text })} />}</CatalogWorkspace>}
        {tab === "delete" && <CatalogWorkspace loading={loading} jerseys={jerseys} selectedId={selectedId} onSelect={setSelectedId}>{selected && <DeletePanel jersey={selected} onDone={(message) => { setNotice({ kind: "success", text: message }); void loadJerseys(); }} onError={(text) => setNotice({ kind: "error", text })} />}</CatalogWorkspace>}
      </div>
    </main>
  );
}

function TabButton({ active, onClick, icon, label, danger = false }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; danger?: boolean }) {
  return <button type="button" onClick={onClick} aria-current={active ? "page" : undefined} className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-xl px-5 text-sm font-black transition [&_svg]:h-4 [&_svg]:w-4 ${active ? danger ? "bg-red-600 text-white shadow-sm" : "bg-black text-white shadow-sm" : danger ? "text-red-600 hover:bg-red-50" : "text-gray-500 hover:bg-gray-50 hover:text-black"}`}>{icon}{label}</button>;
}

function CatalogWorkspace({ loading, jerseys, selectedId, onSelect, children }: { loading: boolean; jerseys: Jersey[]; selectedId: string; onSelect: (id: string) => void; children: React.ReactNode }) {
  if (loading) return <div className="flex justify-center py-20"><LoaderCircle className="h-7 w-7 animate-spin text-emerald-600" /></div>;
  if (!jerseys.length) return <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-12 text-center"><Shirt className="mx-auto mb-3 h-9 w-9 text-gray-300" /><h2 className="font-black">Aún no hay jerseys</h2><p className="mt-1 text-sm text-gray-500">Usa la pestaña Agregar para crear el primero.</p></div>;
  return <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]"><aside className="min-w-0 rounded-3xl border border-gray-200 bg-white p-3 shadow-sm lg:sticky lg:top-6"><p className="px-3 py-2 text-xs font-black uppercase tracking-wider text-gray-400">Selecciona un jersey</p><div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">{jerseys.map((item) => <button type="button" key={item.id} onClick={() => onSelect(item.id)} className={`flex min-h-14 w-56 shrink-0 cursor-pointer items-center gap-3 rounded-2xl p-2 text-left transition lg:w-full ${selectedId === item.id ? "bg-black text-white" : "hover:bg-gray-50"}`}><span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100"><Image src={item.images[0]} alt="" fill sizes="44px" className="object-contain p-1" /></span><span className="min-w-0"><span className="block truncate text-sm font-black">{item.team}</span><span className={`block truncate text-xs ${selectedId === item.id ? "text-white/60" : "text-gray-400"}`}>{item.season} · {item.type}</span></span>{item.soldOut && <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-amber-400" title="Agotado" />}</button>)}</div></aside><div>{children}</div></div>;
}

function JerseyForm({ mode, jersey, onDone, onError }: { mode: "add" | "update"; jersey?: Jersey; onDone: (message: string) => void; onError: (message: string) => void }) {
  const [team, setTeam] = useState(jersey?.team ?? "");
  const [season, setSeason] = useState(jersey?.season ?? "");
  const [type, setType] = useState(jersey?.type ?? "Local");
  const [version, setVersion] = useState<JerseyVersion>(jersey?.version ?? JERSEY_VERSIONS[0]);
  const [selectedSizes, setSelectedSizes] = useState((jersey?.size ?? "").split(",").filter(Boolean));
  const [soldOut, setSoldOut] = useState(jersey?.soldOut ?? false);
  const [files, setFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const id = jersey?.id ?? (team.trim() && season.trim() ? slugify(`${team}-${type}-${season}`) : "");
  const previewUrls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)), [previewUrls]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    if (!selectedSizes.length) return onError("Selecciona al menos una talla.");
    if (mode === "add" && !files.length) return onError("Agrega al menos una imagen.");
    setSaving(true);
    try {
      const form = new FormData(formElement);
      form.delete("images");
      files.forEach((file) => form.append("images", file));
      const response = await fetch(mode === "add" ? "/api/jerseys" : `/api/jerseys/${jersey!.id}`, { method: mode === "add" ? "POST" : "PATCH", body: form });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(result.error ?? "No se pudo guardar.");
      onDone(result.message ?? "Cambios guardados.");
      if (mode === "add") { formElement.reset(); setTeam(""); setSeason(""); setType("Local"); setSelectedSizes([]); setFiles([]); }
    } catch (error) { onError(error instanceof Error ? error.message : "Ocurrió un error."); }
    finally { setSaving(false); }
  };

  return <form onSubmit={submit} className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
    <div className="space-y-6">
      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"><div className="mb-5"><h2 className="text-lg font-black">{mode === "add" ? "Información principal" : `Editar ${jersey!.team}`}</h2>{mode === "update" && <p className="mt-1 text-xs text-gray-400">El ID permanece fijo para conservar sus imágenes y enlaces.</p>}</div><div className="grid gap-5 sm:grid-cols-2">
        <Field label="Equipo o selección"><input name="team" value={team} onChange={(e) => setTeam(e.target.value)} className={inputClass} required /></Field>
        <Field label="Marca"><input name="brand" defaultValue={jersey?.brand} className={inputClass} required /></Field>
        <Field label="Categoría"><select name="category" defaultValue={jersey?.category} className={inputClass}>{categories.map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Subcategoría"><input name="subcategory" defaultValue={jersey?.subcategory} className={inputClass} required /></Field>
        <Field label="Temporada"><input name="season" value={season} onChange={(e) => setSeason(e.target.value)} className={inputClass} placeholder="2025/26" required /></Field>
        <Field label="Tipo"><select name="type" value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>{jerseyTypes.map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Versión"><select name="version" value={version} onChange={(e) => setVersion(e.target.value as JerseyVersion)} className={inputClass}>{JERSEY_VERSIONS.map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="ID"><input name="id" value={id} readOnly className={`${inputClass} bg-gray-50 font-mono text-xs text-gray-500`} /></Field>
      </div><div className="mt-5"><span className={labelClass}>Tallas disponibles</span><input type="hidden" name="size" value={selectedSizes.join(",")} /><div className="flex flex-wrap gap-2">{sizes.map((size) => <button key={size} type="button" aria-pressed={selectedSizes.includes(size)} onClick={() => setSelectedSizes((current) => current.includes(size) ? current.filter((item) => item !== size) : [...current, size])} className={`h-11 min-w-12 cursor-pointer rounded-xl border px-3 text-sm font-black ${selectedSizes.includes(size) ? "border-black bg-black text-white" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>{size}</button>)}</div></div></section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="mb-5 text-lg font-black">Descripción</h2><div className="space-y-5"><Field label="Descripción corta"><textarea name="description" defaultValue={jersey?.description} className={`${inputClass} min-h-24 resize-y`} maxLength={220} required /></Field><Field label="Historia y detalles"><textarea name="details" defaultValue={jersey?.details} className={`${inputClass} min-h-36 resize-y`} required /></Field><Field label="Destacados (separados por comas)"><input name="highlights" defaultValue={jersey?.highlights.join(", ")} className={inputClass} /></Field><Field label="Observaciones"><textarea name="observations" defaultValue={jersey?.observations} className={`${inputClass} min-h-24 resize-y`} /></Field></div></section>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-start justify-between gap-4"><div><h2 className="text-lg font-black">Imágenes</h2><p className="mt-1 text-xs text-gray-400">{mode === "update" ? "Déjalo vacío para conservar las actuales; selecciona nuevas para reemplazarlas." : "Entre 1 y 5 imágenes JPG, PNG o WebP."}</p></div><span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-500">{files.length}/5</span></div><label className="mt-5 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-5 text-center transition hover:border-emerald-400 hover:bg-emerald-50 focus-within:border-emerald-500 focus-within:ring-3 focus-within:ring-emerald-100"><Upload className="mb-2 h-6 w-6 text-emerald-600" /><span className="text-sm font-black">Seleccionar imágenes</span><span className="mt-1 text-xs text-gray-400">La primera será la portada</span><input name="images" type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { setFiles(Array.from(e.currentTarget.files ?? []).slice(0, 5)); e.currentTarget.value = ""; }} /></label>{files.length > 0 && <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">{files.map((file, index) => <div key={`${file.name}-${file.lastModified}`} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-50"><Image src={previewUrls[index]} alt={`Vista previa ${index + 1}: ${file.name}`} fill unoptimized sizes="160px" className="object-contain p-2" />{index === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-md bg-black px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white">Portada</span>}<button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Quitar ${file.name}`} className="absolute right-1.5 top-1.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/75 text-white transition hover:bg-red-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"><X className="h-4 w-4" /></button></div>)}</div>}</section>

      <button disabled={saving} className="inline-flex min-h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-black px-6 text-sm font-black text-white shadow-lg transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50">{saving ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}{saving ? "Guardando…" : mode === "add" ? "Guardar jersey en el catálogo" : "Guardar todos los cambios"}</button>
    </div>

    <aside className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm xl:sticky xl:top-6"><h2 className="text-sm font-black uppercase tracking-wider">Disponibilidad</h2><input type="hidden" name="soldOut" value={String(soldOut)} /><button type="button" role="switch" aria-checked={soldOut} onClick={() => setSoldOut(!soldOut)} className={`mt-4 flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-2xl border p-3 text-left transition ${soldOut ? "border-amber-300 bg-amber-50" : "border-emerald-200 bg-emerald-50"}`}><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${soldOut ? "bg-amber-500 text-white" : "bg-emerald-600 text-white"}`}><PackageCheck className="h-5 w-5" /></span><span><span className="block text-sm font-black">{soldOut ? "Agotado" : "Disponible"}</span><span className="block text-xs text-gray-500">{soldOut ? "La card seguirá visible con etiqueta." : "Se muestra normalmente en el catálogo."}</span></span></button>{jersey?.images[0] && <div className="relative mt-5 aspect-square overflow-hidden rounded-2xl bg-gray-50"><Image src={jersey.images[0]} alt={jersey.team} fill sizes="280px" className="object-contain p-5" />{soldOut && <span className="absolute left-0 top-4 bg-black px-3 py-2 text-[10px] font-black uppercase tracking-wider text-white">Agotado</span>}</div>}</aside>
  </form>;
}

function DeletePanel({ jersey, onDone, onError }: { jersey: Jersey; onDone: (message: string) => void; onError: (message: string) => void }) {
  const [confirmation, setConfirmation] = useState(""); const [deleting, setDeleting] = useState(false);
  const remove = async () => { setDeleting(true); try { const response = await fetch(`/api/jerseys/${jersey.id}`, { method: "DELETE" }); const result = await response.json() as { error?: string; message?: string }; if (!response.ok) throw new Error(result.error); onDone(result.message ?? "Jersey eliminado."); } catch (error) { onError(error instanceof Error ? error.message : "No se pudo eliminar."); } finally { setDeleting(false); } };
  return <section className="rounded-3xl border border-red-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex flex-col gap-6 sm:flex-row"><div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-2xl bg-gray-50 sm:w-48"><Image src={jersey.images[0]} alt={jersey.team} fill sizes="192px" className="object-contain p-4" /></div><div className="flex-1"><span className="text-xs font-black uppercase tracking-wider text-red-600">Zona de peligro</span><h2 className="mt-2 text-2xl font-black">Eliminar {jersey.team}</h2><p className="mt-2 text-sm leading-relaxed text-gray-500">Esta acción borra la ficha y sus imágenes de forma definitiva. Si sólo se vendió temporalmente, usa <strong>Actualizar → Agotado</strong>.</p><label className="mt-5 block"><span className={labelClass}>Escribe ELIMINAR para confirmar</span><input value={confirmation} onChange={(e) => setConfirmation(e.target.value)} className={inputClass} autoComplete="off" /></label><button type="button" disabled={confirmation !== "ELIMINAR" || deleting} onClick={remove} className="mt-4 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto">{deleting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}{deleting ? "Eliminando…" : "Eliminar definitivamente"}</button></div></div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label><span className={labelClass}>{label}</span>{children}</label>; }

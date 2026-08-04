import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import { hasAdminSession } from "@/lib/admin-session";
import { deleteJersey, getDatabase, listJerseys, updateJersey } from "@/lib/database";
import { JERSEY_VERSIONS, type Jersey } from "@/types/jersey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "src", "data", "jerseys.json");
const IMAGES_ROOT = path.join(process.cwd(), "public", "images", "jerseys");
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGES = 5;
const requiredFields = ["team", "category", "subcategory", "season", "brand", "type", "version", "size", "description", "details"] as const;

function text(form: FormData, name: string) {
  const value = form.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function extension(file: File) {
  return ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" } as Record<string, string>)[file.type];
}

async function localJerseys() {
  return JSON.parse(await readFile(DATA_PATH, "utf8")) as Jersey[];
}

async function findJersey(id: string) {
  const jerseys = (await listJerseys()) ?? await localJerseys();
  return jerseys.find((jersey) => jersey.id === id);
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminSession())) return Response.json({ error: "Necesitas iniciar sesión." }, { status: 401 });
  const { id } = await params;
  const current = await findJersey(id);
  if (!current) return Response.json({ error: "El jersey ya no existe." }, { status: 404 });

  try {
    const form = await request.formData();
    const values = Object.fromEntries(requiredFields.map((field) => [field, text(form, field)])) as Record<(typeof requiredFields)[number], string>;
    const missing = requiredFields.find((field) => !values[field]);
    if (missing) return Response.json({ error: `El campo ${missing} es obligatorio.` }, { status: 400 });
    if (!JERSEY_VERSIONS.includes(values.version as Jersey["version"])) return Response.json({ error: "La versión no es válida." }, { status: 400 });

    const images = form.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);
    if (images.length > MAX_IMAGES) return Response.json({ error: `Puedes usar hasta ${MAX_IMAGES} imágenes.` }, { status: 400 });
    for (const image of images) {
      if (!extension(image)) return Response.json({ error: "Las imágenes deben ser JPG, PNG o WebP." }, { status: 400 });
      if (image.size > MAX_IMAGE_SIZE) return Response.json({ error: "Cada imagen debe pesar menos de 8 MB." }, { status: 400 });
    }

    let imagePaths = current.images;
    if (images.length) {
      if (getDatabase()) {
        const uploaded: string[] = [];
        for (const [index, image] of images.entries()) {
          const blob = await put(`jerseys/${id}/${String(index + 1).padStart(2, "0")}${extension(image)}`, image, { access: "public", addRandomSuffix: true });
          uploaded.push(blob.url);
        }
        await del(current.images.filter((image) => image.startsWith("http"))).catch(() => undefined);
        imagePaths = uploaded;
      } else {
        const directory = path.join(IMAGES_ROOT, id);
        await rm(directory, { recursive: true, force: true });
        await mkdir(directory, { recursive: true });
        imagePaths = [];
        for (const [index, image] of images.entries()) {
          const filename = `${String(index + 1).padStart(2, "0")}${extension(image)}`;
          await writeFile(path.join(directory, filename), Buffer.from(await image.arrayBuffer()));
          imagePaths.push(`/images/jerseys/${id}/${filename}`);
        }
      }
    }

    const jersey: Jersey = {
      ...current,
      ...values,
      version: values.version as Jersey["version"],
      images: imagePaths,
      highlights: text(form, "highlights").split(",").map((item) => item.trim()).filter(Boolean),
      observations: text(form, "observations"),
      soldOut: text(form, "soldOut") === "true",
    };

    if (getDatabase()) {
      if (!(await updateJersey(id, jersey))) return Response.json({ error: "El jersey ya no existe." }, { status: 404 });
    } else {
      const jerseys = await localJerseys();
      await writeFile(DATA_PATH, `${JSON.stringify(jerseys.map((item) => item.id === id ? jersey : item), null, 2)}\n`, "utf8");
    }
    return Response.json({ message: "Jersey actualizado correctamente.", jersey });
  } catch (error) {
    console.error("No se pudo actualizar el jersey:", error);
    return Response.json({ error: "No se pudo actualizar. Inténtalo nuevamente." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await hasAdminSession())) return Response.json({ error: "Necesitas iniciar sesión." }, { status: 401 });
  const { id } = await params;
  const current = await findJersey(id);
  if (!current) return Response.json({ error: "El jersey ya no existe." }, { status: 404 });

  try {
    if (getDatabase()) {
      if (!(await deleteJersey(id))) return Response.json({ error: "El jersey ya no existe." }, { status: 404 });
      await del(current.images.filter((image) => image.startsWith("http"))).catch(() => undefined);
    } else {
      const jerseys = await localJerseys();
      await writeFile(DATA_PATH, `${JSON.stringify(jerseys.filter((item) => item.id !== id), null, 2)}\n`, "utf8");
      await rm(path.join(IMAGES_ROOT, id), { recursive: true, force: true });
    }
    return Response.json({ message: "Jersey eliminado definitivamente." });
  } catch (error) {
    console.error("No se pudo eliminar el jersey:", error);
    return Response.json({ error: "No se pudo eliminar. Inténtalo nuevamente." }, { status: 500 });
  }
}

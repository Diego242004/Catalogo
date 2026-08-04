import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";
import { JERSEY_VERSIONS, type Jersey } from "@/types/jersey";
import { hasAdminSession } from "@/lib/admin-session";
import { getDatabase, insertJersey, jerseyExists, listJerseys } from "@/lib/database";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "src", "data", "jerseys.json");
const IMAGES_ROOT = path.join(process.cwd(), "public", "images", "jerseys");
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const MAX_IMAGES = 5;

const requiredFields = [
  "id", "team", "category", "subcategory", "season", "brand",
  "type", "version", "size", "description", "details",
] as const;

function readText(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function safeExtension(file: File) {
  const extensions: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };
  return extensions[file.type];
}

async function readLocalJerseys() {
  return JSON.parse(await readFile(DATA_PATH, "utf8")) as Jersey[];
}

export async function GET() {
  try {
    const databaseJerseys = await listJerseys();
    return Response.json(databaseJerseys ?? await readLocalJerseys());
  } catch (error) {
    console.error("No se pudo leer el catálogo:", error);
    return Response.json({ error: "No se pudo cargar el catálogo." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return Response.json({ error: "Necesitas iniciar sesión para agregar jerseys." }, { status: 401 });
  }

  let createdImageDirectory: string | null = null;
  const uploadedBlobUrls: string[] = [];

  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return Response.json({ error: "Envía los datos usando el formulario de administración." }, { status: 400 });
    }

    const values = Object.fromEntries(
      requiredFields.map((field) => [field, readText(formData, field)]),
    ) as Record<(typeof requiredFields)[number], string>;

    const missingField = requiredFields.find((field) => !values[field]);
    if (missingField) {
      return Response.json({ error: `El campo ${missingField} es obligatorio.` }, { status: 400 });
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.id)) {
      return Response.json(
        { error: "El ID sólo puede contener letras minúsculas, números y guiones." },
        { status: 400 },
      );
    }

    if (!JERSEY_VERSIONS.includes(values.version as Jersey["version"])) {
      return Response.json({ error: "La versión seleccionada no es válida." }, { status: 400 });
    }

    const images = formData
      .getAll("images")
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (images.length === 0 || images.length > MAX_IMAGES) {
      return Response.json({ error: `Agrega entre 1 y ${MAX_IMAGES} imágenes.` }, { status: 400 });
    }

    for (const image of images) {
      if (!safeExtension(image)) {
        return Response.json({ error: "Las imágenes deben ser JPG, PNG o WebP." }, { status: 400 });
      }
      if (image.size > MAX_IMAGE_SIZE) {
        return Response.json({ error: "Cada imagen debe pesar menos de 8 MB." }, { status: 400 });
      }
    }

    const usesDatabase = Boolean(getDatabase());
    const currentJerseys = usesDatabase ? null : await readLocalJerseys();
    const duplicate = usesDatabase
      ? await jerseyExists(values.id)
      : currentJerseys!.some((jersey) => jersey.id === values.id);

    if (duplicate) {
      return Response.json(
        { error: "Ya existe un jersey con ese ID. Modifica el equipo o la temporada." },
        { status: 409 },
      );
    }

    const imagePaths: string[] = [];
    if (usesDatabase) {
      for (const [index, image] of images.entries()) {
        const filename = `${String(index + 1).padStart(2, "0")}${safeExtension(image)!}`;
        const blob = await put(`jerseys/${values.id}/${filename}`, image, {
          access: "public",
          addRandomSuffix: true,
        });
        uploadedBlobUrls.push(blob.url);
        imagePaths.push(blob.url);
      }
    } else {
      await mkdir(IMAGES_ROOT, { recursive: true });
      createdImageDirectory = path.join(IMAGES_ROOT, values.id);
      await mkdir(createdImageDirectory, { recursive: false });

      for (const [index, image] of images.entries()) {
        const filename = `${String(index + 1).padStart(2, "0")}${safeExtension(image)!}`;
        await writeFile(path.join(createdImageDirectory, filename), Buffer.from(await image.arrayBuffer()));
        imagePaths.push(`/images/jerseys/${values.id}/${filename}`);
      }
    }

    const jersey: Jersey = {
      id: values.id,
      team: values.team,
      category: values.category,
      subcategory: values.subcategory,
      season: values.season,
      brand: values.brand,
      type: values.type,
      version: values.version as Jersey["version"],
      size: values.size,
      description: values.description,
      details: values.details,
      images: imagePaths,
      highlights: readText(formData, "highlights").split(",").map((item) => item.trim()).filter(Boolean),
      observations: readText(formData, "observations"),
      soldOut: readText(formData, "soldOut") === "true",
    };

    if (usesDatabase) {
      await insertJersey(jersey);
    } else {
      await writeFile(DATA_PATH, `${JSON.stringify([...currentJerseys!, jersey], null, 2)}\n`, "utf8");
    }

    return Response.json({ message: "Jersey agregado correctamente.", jersey }, { status: 201 });
  } catch (error) {
    if (createdImageDirectory) {
      await rm(createdImageDirectory, { recursive: true, force: true }).catch(() => undefined);
    }
    if (uploadedBlobUrls.length > 0) {
      await del(uploadedBlobUrls).catch(() => undefined);
    }
    console.error("No se pudo guardar el jersey:", error);
    return Response.json(
      { error: "No se pudo guardar el jersey. Revisa los datos e inténtalo nuevamente." },
      { status: 500 },
    );
  }
}

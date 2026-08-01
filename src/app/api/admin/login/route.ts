import { createAdminSession, isValidAccessKey } from "@/lib/admin-session";

export async function POST(request: Request) {
  let accessKey = "";
  try {
    const body = (await request.json()) as { accessKey?: unknown };
    accessKey = typeof body.accessKey === "string" ? body.accessKey : "";
  } catch {
    return Response.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!accessKey || !isValidAccessKey(accessKey)) {
    return Response.json({ error: "La clave de acceso no es correcta." }, { status: 401 });
  }

  await createAdminSession();
  return Response.json({ message: "Acceso concedido." });
}

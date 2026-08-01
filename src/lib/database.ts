import postgres from "postgres";
import type { Jersey } from "@/types/jersey";

let databaseClient: ReturnType<typeof postgres> | null = null;

export function getDatabase() {
  const connectionString = process.env.POSTGRES_URL;
  if (!connectionString) return null;

  databaseClient ??= postgres(connectionString, {
    max: 1,
    prepare: false,
    ssl: "require",
  });

  return databaseClient;
}

export async function listJerseys(): Promise<Jersey[] | null> {
  const sql = getDatabase();
  if (!sql) return null;

  const rows = await sql<{ data: Jersey }[]>`
    select data
    from jerseys
    order by lower(data->>'team'), created_at
  `;

  return rows.map((row) => row.data);
}

export async function jerseyExists(id: string) {
  const sql = getDatabase();
  if (!sql) return false;

  const rows = await sql<{ exists: boolean }[]>`
    select exists(select 1 from jerseys where id = ${id}) as exists
  `;
  return rows[0]?.exists ?? false;
}

export async function insertJersey(jersey: Jersey) {
  const sql = getDatabase();
  if (!sql) return false;

  await sql`
    insert into jerseys (id, data)
    values (${jersey.id}, ${JSON.stringify(jersey)}::jsonb)
  `;
  return true;
}

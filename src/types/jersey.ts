export const JERSEY_VERSIONS = [
  "Versión Fan",
  "Versión Jugador",
  "Versión Equipo",
] as const;

export type JerseyVersion = (typeof JERSEY_VERSIONS)[number];

export interface Jersey {
  id: string;
  team: string;
  category: string;
  subcategory: string;
  season: string;
  brand: string;
  type: string;
  version: JerseyVersion;
  size: string;
  description: string;
  details: string;
  images: string[];
  highlights: string[];
  observations: string;
}

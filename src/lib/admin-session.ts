import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "jersey_admin_session";
const SESSION_DURATION_SECONDS = 8 * 60 * 60;

type SessionPayload = { expiresAt: number };

function getRequiredEnv(name: "ADMIN_ACCESS_KEY" | "ADMIN_SESSION_SECRET") {
  const value = process.env[name];
  if (!value) throw new Error(`Falta configurar ${name}.`);
  return value;
}

function sign(value: string) {
  return createHmac("sha256", getRequiredEnv("ADMIN_SESSION_SECRET"))
    .update(value)
    .digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

export function isValidAccessKey(candidate: string) {
  return safeEqual(candidate, getRequiredEnv("ADMIN_ACCESS_KEY"));
}

export async function createAdminSession() {
  const payload: SessionPayload = { expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1000 };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");

  (await cookies()).set(COOKIE_NAME, `${encodedPayload}.${sign(encodedPayload)}`, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION_SECONDS,
    path: "/",
  });
}

export async function hasAdminSession() {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload))) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SessionPayload;
    return Number.isFinite(payload.expiresAt) && payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE_NAME);
}

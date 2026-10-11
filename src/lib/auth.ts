import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";

const COOKIE = "veyra_session";
const WEEK = 60 * 60 * 24 * 7;

function key() {
  const s = process.env.AUTH_SECRET;
  if (s && s.length >= 32) return new TextEncoder().encode(s);
  // Development only: fall back so a missing .env value never blocks you. Production requires a real secret.
  if (process.env.NODE_ENV !== "production") return new TextEncoder().encode("veyra-dev-only-secret-change-me-0123456789");
  throw new Error("AUTH_SECRET is missing or shorter than 32 characters.");
}

export async function createSession(userId: string) {
  const token = await new SignJWT({}).setProtectedHeader({ alg: "HS256" })
    .setSubject(userId).setIssuedAt().setExpirationTime("7d").sign(key());
  cookies().set(COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: WEEK,
  });
}

export function destroySession() {
  cookies().delete(COOKIE);
}

export async function getUser() {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key());
    if (!payload.sub) return null;
    return await db.user.findUnique({
      where: { id: payload.sub }, select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  } catch {
    return null;
  }
}

// For server-rendered pages: redirect to login (or 404-style home) if not allowed.
export async function requirePageUser(next: string) {
  const u = await getUser();
  if (!u) redirect(`/login?next=${encodeURIComponent(next)}`);
  return u;
}

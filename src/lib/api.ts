import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import { getUser } from "./auth";

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export const ok = (data: unknown = {}, status = 200) => NextResponse.json({ ok: true, data }, { status });
export const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

// Wraps a handler so every error becomes a consistent JSON response.
export function route(fn: (req: Request, ctx: any) => Promise<NextResponse>) {
  return async (req: Request, ctx: any) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      if (e instanceof HttpError) return fail(e.message, e.status);
      if (e instanceof ZodError) return fail(e.issues[0]?.message ?? "Invalid input", 422);
      console.error(e);
      const detail = process.env.NODE_ENV !== "production" && e instanceof Error ? ` (${e.message.split("\n").pop()})` : "";
      return fail(`Something went wrong. Please try again.${detail}`, 500);
    }
  };
}

export async function body<T>(req: Request, schema: ZodType<T, any, any>): Promise<T> {
  let json: unknown;
  try { json = await req.json(); } catch { throw new HttpError(400, "Invalid request body"); }
  return schema.parse(json);
}

export async function requireUser() {
  const u = await getUser();
  if (!u) throw new HttpError(401, "Please sign in to continue");
  return u;
}

export async function requireAdmin() {
  const u = await requireUser();
  if (u.role !== "ADMIN") throw new HttpError(403, "You do not have access to this");
  return u;
}

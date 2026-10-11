import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { route, body, ok, HttpError } from "@/lib/api";
import { registerInput } from "@/lib/validate";

export const POST = route(async (req) => {
  const b = await body(req, registerInput);
  if (await db.user.findUnique({ where: { email: b.email } }))
    throw new HttpError(409, "An account with this email already exists");
  const user = await db.user.create({
    data: { name: b.name, email: b.email, passwordHash: await bcrypt.hash(b.password, 12) },
  });
  await createSession(user.id);
  return ok({ id: user.id }, 201);
});

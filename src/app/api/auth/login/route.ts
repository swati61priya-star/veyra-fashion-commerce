import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { route, body, ok, HttpError } from "@/lib/api";
import { loginInput } from "@/lib/validate";

export const POST = route(async (req) => {
  const b = await body(req, loginInput);
  const user = await db.user.findUnique({ where: { email: b.email } });
  // Same message for unknown email and wrong password (no account enumeration).
  if (!user || !(await bcrypt.compare(b.password, user.passwordHash)))
    throw new HttpError(401, "Invalid email or password");
  await createSession(user.id);
  return ok({ id: user.id });
});

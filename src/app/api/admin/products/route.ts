import { db } from "@/lib/db";
import { slugify } from "@/lib/format";
import { route, body, ok, requireAdmin } from "@/lib/api";
import { productInput } from "@/lib/validate";

export const POST = route(async (req) => {
  await requireAdmin();
  const b = await body(req, productInput);
  const slug = `${slugify(b.name)}-${Math.random().toString(36).slice(2, 6)}`;
  const p = await db.product.create({ data: { ...b, image: b.image || null, slug } });
  return ok({ id: p.id }, 201);
});

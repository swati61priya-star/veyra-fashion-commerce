import { db } from "@/lib/db";
import { route, body, ok, requireAdmin, HttpError } from "@/lib/api";
import { productInput } from "@/lib/validate";

export const PATCH = route(async (req, ctx: { params: { id: string } }) => {
  await requireAdmin();
  const b = await body(req, productInput.partial());
  if (!(await db.product.findUnique({ where: { id: ctx.params.id }, select: { id: true } })))
    throw new HttpError(404, "Product not found");
  await db.product.update({ where: { id: ctx.params.id }, data: b });
  return ok();
});

export const DELETE = route(async (_req, ctx: { params: { id: string } }) => {
  await requireAdmin();
  await db.product.deleteMany({ where: { id: ctx.params.id } });
  return ok();
});

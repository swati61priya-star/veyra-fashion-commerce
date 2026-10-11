import { db } from "@/lib/db";
import { route, body, ok, requireAdmin, HttpError } from "@/lib/api";
import { statusInput } from "@/lib/validate";

export const PATCH = route(async (req, ctx: { params: { id: string } }) => {
  await requireAdmin();
  const b = await body(req, statusInput);
  if (!(await db.order.findUnique({ where: { id: ctx.params.id }, select: { id: true } })))
    throw new HttpError(404, "Order not found");
  await db.order.update({ where: { id: ctx.params.id }, data: { status: b.status } });
  return ok();
});

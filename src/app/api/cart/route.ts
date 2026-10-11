import { db } from "@/lib/db";
import { split } from "@/lib/format";
import { route, body, ok, requireUser, HttpError } from "@/lib/api";
import { cartAdd, cartUpdate, cartRemove } from "@/lib/validate";

export const POST = route(async (req) => {
  const user = await requireUser();
  const b = await body(req, cartAdd);
  const p = await db.product.findUnique({ where: { id: b.productId } });
  if (!p) throw new HttpError(404, "Product not found");
  if (!split(p.sizes).includes(b.size)) throw new HttpError(422, "Invalid size");
  if (!split(p.colors).includes(b.color)) throw new HttpError(422, "Invalid color");
  if (p.stock < 1) throw new HttpError(409, "This item is out of stock");

  const where = { userId_productId_size_color: { userId: user.id, productId: p.id, size: b.size, color: b.color } };
  const existing = await db.cartItem.findUnique({ where });
  const quantity = Math.min((existing?.quantity ?? 0) + b.quantity, p.stock);
  if (existing) await db.cartItem.update({ where: { id: existing.id }, data: { quantity } });
  else await db.cartItem.create({ data: { userId: user.id, productId: p.id, size: b.size, color: b.color, quantity } });
  return ok({ quantity });
});

export const PATCH = route(async (req) => {
  const user = await requireUser();
  const b = await body(req, cartUpdate);
  const item = await db.cartItem.findFirst({ where: { id: b.itemId, userId: user.id }, include: { product: true } });
  if (!item) throw new HttpError(404, "Cart item not found");
  if (b.quantity > item.product.stock) throw new HttpError(409, `Only ${item.product.stock} in stock`);
  await db.cartItem.update({ where: { id: item.id }, data: { quantity: b.quantity } });
  return ok();
});

export const DELETE = route(async (req) => {
  const user = await requireUser();
  const b = await body(req, cartRemove);
  await db.cartItem.deleteMany({ where: { id: b.itemId, userId: user.id } });
  return ok();
});

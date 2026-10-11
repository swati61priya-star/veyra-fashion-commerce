import { db } from "@/lib/db";
import { route, body, ok, requireUser, HttpError } from "@/lib/api";
import { wishlistInput } from "@/lib/validate";

// Toggles a product in the signed-in user's wishlist.
export const POST = route(async (req) => {
  const user = await requireUser();
  const b = await body(req, wishlistInput);
  const existing = await db.wishlistItem.findUnique({
    where: { userId_productId: { userId: user.id, productId: b.productId } },
  });
  if (existing) {
    await db.wishlistItem.delete({ where: { id: existing.id } });
    return ok({ wished: false });
  }
  if (!(await db.product.findUnique({ where: { id: b.productId }, select: { id: true } })))
    throw new HttpError(404, "Product not found");
  await db.wishlistItem.create({ data: { userId: user.id, productId: b.productId } });
  return ok({ wished: true });
});

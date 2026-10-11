import { db } from "@/lib/db";
import { computeSubtotal, shippingFor } from "@/lib/orders";
import { route, body, ok, requireUser, HttpError } from "@/lib/api";
import { checkoutInput } from "@/lib/validate";

// Simulated payment: no card data is collected. Prices come from the database only.
export const POST = route(async (req) => {
  const user = await requireUser();
  const b = await body(req, checkoutInput);

  // Duplicate submission (same key) returns the original order.
  const prior = await db.order.findUnique({ where: { idempotencyKey: b.idempotencyKey } });
  if (prior) {
    if (prior.userId !== user.id) throw new HttpError(409, "Duplicate request");
    return ok({ orderId: prior.id });
  }

  const order = await db.$transaction(async (tx) => {
    const items = await tx.cartItem.findMany({ where: { userId: user.id }, include: { product: true } });
    if (items.length === 0) throw new HttpError(400, "Your cart is empty");

    for (const i of items) {
      const r = await tx.product.updateMany({
        where: { id: i.productId, stock: { gte: i.quantity } },
        data: { stock: { decrement: i.quantity } },
      });
      if (r.count === 0) throw new HttpError(409, `Not enough stock for ${i.product.name}`);
    }

    const subtotal = computeSubtotal(items.map((i) => ({ priceCents: i.product.priceCents, quantity: i.quantity })));
    const shipping = shippingFor(subtotal);
    const created = await tx.order.create({
      data: {
        userId: user.id, status: "PROCESSING",
        subtotalCents: subtotal, shippingCents: shipping, totalCents: subtotal + shipping,
        shipName: b.name, shipAddress: b.address, shipCity: b.city, shipPostal: b.postal,
        idempotencyKey: b.idempotencyKey,
        items: {
          create: items.map((i) => ({
            productId: i.productId, name: i.product.name, size: i.size, color: i.color,
            priceCents: i.product.priceCents, quantity: i.quantity,
          })),
        },
      },
    });
    await tx.cartItem.deleteMany({ where: { userId: user.id } });
    return created;
  });
  return ok({ orderId: order.id }, 201);
});

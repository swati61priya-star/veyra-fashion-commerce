import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { requirePageUser } from "@/lib/auth";
import { money } from "@/lib/format";
import { computeSubtotal, shippingFor } from "@/lib/orders";
import CheckoutForm from "@/components/CheckoutForm";
import ProductImage from "@/components/ProductImage";

export const dynamic = "force-dynamic";

export default async function Checkout() {
  const user = await requirePageUser("/checkout");
  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  if (items.length === 0) redirect("/cart");

  const subtotal = computeSubtotal(
    items.map((i) => ({ priceCents: i.product.priceCents, quantity: i.quantity }))
  );
  const shipping = shippingFor(subtotal);

  return (
    <div className="container-v py-10 lg:py-14 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-ink/10 pb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
            Secure Step 2 of 2
          </span>
          <h1 className="mt-1 text-4xl font-display text-ink">Checkout & Dispatch</h1>
        </div>
        <Link
          href="/cart"
          className="text-xs uppercase tracking-wider text-charcoal hover:text-ink underline underline-offset-4"
        >
          Return to Cart
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
        {/* Left: Shipping & Payment Form */}
        <CheckoutForm defaultName={user.name} />

        {/* Right: Order Summary with thumbnails */}
        <aside className="card self-start space-y-6 bg-white/95 shadow-sm">
          <div className="flex items-center justify-between border-b border-ink/10 pb-4">
            <h2 className="text-xl font-display text-ink">Your Order</h2>
            <span className="text-xs font-semibold text-charcoal/60">
              {items.reduce((n, i) => n + i.quantity, 0)} items
            </span>
          </div>

          {/* Line items list with thumbnails */}
          <ul className="divide-y divide-ink/10 space-y-3 pt-1">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3.5 pt-3 first:pt-0">
                <div className="h-16 w-14 overflow-hidden rounded-xl bg-sand/40 shrink-0 border border-ink/5">
                  <ProductImage
                    src={i.product.image}
                    name={i.product.name}
                    category={i.product.category}
                    color={i.color}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-ink">{i.product.name}</p>
                  <p className="text-[11px] text-charcoal/60">
                    Size {i.size} · {i.color} × {i.quantity}
                  </p>
                </div>
                <p className="text-xs font-semibold text-ink">
                  {money(i.product.priceCents * i.quantity)}
                </p>
              </li>
            ))}
          </ul>

          {/* Totals Breakdown */}
          <dl className="space-y-2.5 border-t border-ink/10 pt-4 text-xs text-charcoal/80">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-ink">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Express Shipping</dt>
              <dd className="font-semibold text-ink">
                {shipping === 0 ? <span className="text-green-800">FREE</span> : money(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-3 text-sm font-bold text-ink">
              <dt>Order Total</dt>
              <dd className="text-lg text-ink">{money(subtotal + shipping)}</dd>
            </div>
          </dl>

          {/* Delivery estimate */}
          <div className="rounded-xl bg-sand/30 p-3.5 text-xs text-charcoal/70 space-y-1">
            <p className="font-semibold text-ink">Estimated Dispatch</p>
            <p>Dispatched in 24 hours via premium express delivery.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

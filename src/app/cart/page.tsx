import Link from "next/link";
import { db } from "@/lib/db";
import { requirePageUser } from "@/lib/auth";
import { money } from "@/lib/format";
import { computeSubtotal, shippingFor } from "@/lib/orders";
import CartRow from "@/components/CartRow";

export const dynamic = "force-dynamic";

export default async function Cart() {
  const user = await requirePageUser("/cart");
  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "asc" },
  });

  const subtotal = computeSubtotal(
    items.map((i) => ({ priceCents: i.product.priceCents, quantity: i.quantity }))
  );
  const shipping = shippingFor(subtotal);
  const freeShippingThreshold = 399900; // in paise (₹3,999)
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (items.length === 0) {
    return (
      <div className="container-v py-24 text-center max-w-xl mx-auto space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sand/60 text-charcoal/60">
          <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display text-ink">Your cart is empty</h1>
        <p className="text-charcoal/70 text-base leading-relaxed">
          Your shopping bag currently has no garments. Explore our new season staples and timeless natural pieces.
        </p>
        <div className="pt-4">
          <Link href="/shop" className="btn !py-4 !px-8">
            Explore Collection →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-v py-10 lg:py-14 space-y-8">
      <div className="flex items-center justify-between border-b border-ink/10 pb-6">
        <div>
          <h1 className="text-4xl font-display text-ink">Shopping Bag</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {items.reduce((n, i) => n + i.quantity, 0)} {items.reduce((n, i) => n + i.quantity, 0) === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <Link href="/shop" className="text-xs uppercase tracking-wider text-charcoal hover:text-ink underline underline-offset-4">
          Continue shopping
        </Link>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
        {/* Left Column: Cart Items List */}
        <div className="space-y-6">
          {/* Free Shipping Progress Indicator */}
          <div className="rounded-2xl border border-ink/10 bg-sand/40 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-ink">
                {remainingForFreeShipping === 0
                  ? "🎉 You have qualified for FREE Express Shipping!"
                  : `Add ${money(remainingForFreeShipping)} more to qualify for FREE Shipping`}
              </span>
              <span className="text-terracotta">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-sand">
              <div
                className="h-full rounded-full bg-terracotta transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <ul className="divide-y divide-ink/10">
            {items.map((i) => (
              <CartRow key={i.id} item={i} />
            ))}
          </ul>
        </div>

        {/* Right Column: Order Summary Card */}
        <aside className="card self-start space-y-6 bg-white/95">
          <h2 className="text-2xl font-display text-ink">Order Summary</h2>

          <dl className="space-y-3 text-sm text-charcoal/80">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="font-semibold text-ink">{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Estimated Delivery</dt>
              <dd className="font-semibold text-ink">
                {shipping === 0 ? <span className="text-green-800">FREE</span> : money(shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-4 text-base font-bold text-ink">
              <dt>Total (Incl. all taxes)</dt>
              <dd className="text-xl text-ink">{money(subtotal + shipping)}</dd>
            </div>
          </dl>

          {/* Simulated Promo Code */}
          <div className="pt-2 border-t border-ink/10">
            <label htmlFor="promo" className="label">Promotional Code</label>
            <div className="flex gap-2">
              <input
                id="promo"
                placeholder="e.g. VEYRA10"
                className="input !py-2.5 !text-xs uppercase"
              />
              <button
                type="button"
                className="btn-ghost !px-4 !py-2.5 !text-xs font-semibold"
              >
                Apply
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-charcoal/50">
              Demo discount: 10% applied automatically at final review
            </p>
          </div>

          <div className="pt-2">
            <Link href="/checkout" className="btn w-full !py-4 !text-sm font-semibold shadow-md">
              Proceed to Checkout →
            </Link>
          </div>

          <p className="text-center text-[11px] text-charcoal/60">
            Simulated checkout · No payment cards required
          </p>
        </aside>
      </div>
    </div>
  );
}

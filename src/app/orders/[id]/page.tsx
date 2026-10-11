import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requirePageUser } from "@/lib/auth";
import { money } from "@/lib/format";
import ProductImage from "@/components/ProductImage";

export const dynamic = "force-dynamic";

const STATUS_STEPS = ["PROCESSING", "SHIPPED", "DELIVERED"];

export default async function OrderPage({ params }: { params: { id: string } }) {
  const user = await requirePageUser(`/orders/${params.id}`);
  const order = await db.order.findFirst({
    where: { id: params.id, userId: user.id },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="container-v max-w-4xl py-12 lg:py-16 space-y-10">
      {/* Order Status Banner */}
      <div className="rounded-3xl border border-ink/10 bg-white p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ink/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
              <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
              Order Confirmed & Logged
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl font-display text-ink">
              Thank you, {order.shipName.split(" ")[0]}.
            </h1>
            <p className="mt-1 text-xs text-charcoal/60">
              Order ID: <span className="font-mono font-bold text-ink">#{order.id.slice(-8).toUpperCase()}</span> · Placed on {order.createdAt.toLocaleDateString("en-IN", { dateStyle: "long" })}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-wider text-charcoal/50">Total Amount</p>
            <p className="text-2xl font-bold text-ink">{money(order.totalCents)}</p>
          </div>
        </div>

        {/* Visual Progress Timeline */}
        <div className="pt-2 space-y-3">
          <p className="text-xs uppercase tracking-widest text-charcoal/60 font-semibold">
            Fulfillment Journey
          </p>
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            {STATUS_STEPS.map((st, i) => {
              const isPastOrCurrent = currentStepIndex >= i || (order.status === "DELIVERED");
              const isCurrent = order.status === st;
              return (
                <div key={st} className="space-y-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isPastOrCurrent ? "bg-terracotta" : "bg-sand"
                    }`}
                  />
                  <p className={`font-semibold ${isCurrent ? "text-terracotta" : "text-charcoal/70"}`}>
                    {st === "PROCESSING" ? "1. Preparing" : st === "SHIPPED" ? "2. On the Way" : "3. Delivered"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Items & Shipping Breakdown */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Items List */}
        <div className="lg:col-span-7 card space-y-4 bg-white">
          <h2 className="text-xl font-display text-ink border-b border-ink/10 pb-3">
            Garments in This Shipment ({order.items.reduce((acc, it) => acc + it.quantity, 0)})
          </h2>
          <ul className="divide-y divide-ink/10">
            {order.items.map((i) => (
              <li key={i.id} className="flex items-center gap-4 py-4 first:pt-2">
                <div className="h-16 w-14 overflow-hidden rounded-xl bg-sand/40 shrink-0 border border-ink/5">
                  <ProductImage
                    src={i.product?.image}
                    name={i.name}
                    category={i.product?.category ?? "Tops"}
                    color={i.color}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{i.name}</p>
                  <p className="text-xs text-charcoal/60">
                    Size {i.size} · {i.color} · Qty {i.quantity}
                  </p>
                </div>
                <p className="text-sm font-semibold text-ink">
                  {money(i.priceCents * i.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card space-y-4 bg-white">
            <h2 className="text-xl font-display text-ink border-b border-ink/10 pb-3">
              Shipping Address
            </h2>
            <div className="text-xs leading-relaxed text-charcoal/80 space-y-1">
              <p className="font-semibold text-ink text-sm">{order.shipName}</p>
              <p>{order.shipAddress}</p>
              <p>{order.shipCity}, {order.shipPostal}</p>
              <p className="pt-2 text-terracotta font-medium">Standard Express Delivery (2-4 Days)</p>
            </div>
          </div>

          <div className="card space-y-3 bg-white text-xs">
            <h2 className="text-lg font-display text-ink border-b border-ink/10 pb-2">
              Payment Summary
            </h2>
            <div className="flex justify-between text-charcoal/80">
              <span>Subtotal</span>
              <span className="font-semibold text-ink">{money(order.subtotalCents)}</span>
            </div>
            <div className="flex justify-between text-charcoal/80">
              <span>Delivery Charges</span>
              <span className="font-semibold text-ink">
                {order.shippingCents === 0 ? "FREE" : money(order.shippingCents)}
              </span>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 text-sm font-bold text-ink">
              <span>Total Paid</span>
              <span>{money(order.totalCents)}</span>
            </div>
            <p className="text-[10px] text-charcoal/50 pt-1">
              Simulated demonstration transaction · No card charged
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">
        <Link href="/account" className="btn">
          View All Orders
        </Link>
        <Link href="/shop" className="btn-ghost">
          Keep Shopping →
        </Link>
      </div>
    </div>
  );
}

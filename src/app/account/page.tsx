import Link from "next/link";
import { db } from "@/lib/db";
import { requirePageUser } from "@/lib/auth";
import { money } from "@/lib/format";
import { recommend } from "@/lib/recommend";
import ProductCard from "@/components/ProductCard";
import SignOutButton from "@/components/SignOutButton";

export const dynamic = "force-dynamic";

export default async function Account() {
  const user = await requirePageUser("/account");
  const [orders, wish, ordered] = await Promise.all([
    db.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    }),
    db.wishlistItem.findMany({ where: { userId: user.id }, include: { product: true } }),
    db.orderItem.findMany({ where: { order: { userId: user.id } }, include: { product: true } }),
  ]);

  const seeds = [
    ...wish.map((w) => w.product),
    ...ordered.flatMap((o) => (o.product ? [o.product] : [])),
  ];
  const picks = recommend(await db.product.findMany({ where: { image: { not: null } } }), seeds, { limit: 4 });

  return (
    <div className="container-v py-10 lg:py-16 space-y-12">
      {/* Account Profile Banner */}
      <div className="rounded-3xl border border-ink/10 bg-white p-8 sm:p-10 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink text-2xl font-bold font-display text-white">
              {user.name[0]?.toUpperCase() ?? "V"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display text-ink">{user.name}</h1>
                {user.role === "ADMIN" && (
                  <span className="rounded-full bg-terracotta/10 px-2.5 py-0.5 text-[10px] font-bold text-terracotta">
                    ADMIN
                  </span>
                )}
              </div>
              <p className="text-xs text-charcoal/60 mt-0.5">{user.email}</p>
              <p className="text-[11px] text-charcoal/40 mt-1">
                Member of Veyra Circle since {user.createdAt.getFullYear()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/wishlist" className="btn-ghost !py-2.5 !px-5 !text-xs font-semibold">
              Wishlist ({wish.length})
            </Link>
            <SignOutButton />
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-ink/10 pt-6">
          <div className="rounded-2xl bg-sand/30 p-4">
            <p className="text-xs text-charcoal/60 font-medium">Completed Orders</p>
            <p className="text-2xl font-bold text-ink mt-1">{orders.length}</p>
          </div>
          <div className="rounded-2xl bg-sand/30 p-4">
            <p className="text-xs text-charcoal/60 font-medium">Saved Garments</p>
            <p className="text-2xl font-bold text-ink mt-1">{wish.length}</p>
          </div>
          <div className="col-span-2 sm:col-span-1 rounded-2xl bg-sand/30 p-4">
            <p className="text-xs text-charcoal/60 font-medium">Tier Status</p>
            <p className="text-2xl font-bold text-terracotta mt-1">Silver Member</p>
          </div>
        </div>
      </div>

      {/* Order History */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-ink/10 pb-4">
          <h2 className="text-2xl sm:text-3xl font-display text-ink">Order History</h2>
          <span className="text-xs font-medium text-charcoal/60">{orders.length} orders logged</span>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-ink/20 bg-white/70 py-16 text-center space-y-3">
            <p className="text-base text-charcoal/70">You have not placed any orders yet.</p>
            <div className="pt-2">
              <Link href="/shop" className="btn !py-3 !px-6 !text-xs">
                Start Shopping →
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:border-ink/20"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-ink">
                      #{o.id.slice(-8).toUpperCase()}
                    </span>
                    <span
                      className={`badge ${
                        o.status === "DELIVERED"
                          ? "bg-emerald-100 text-emerald-800"
                          : o.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-sand text-charcoal"
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/60">
                    Placed on {o.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })} ·{" "}
                    {o.items.reduce((n, i) => n + i.quantity, 0)} {o.items.reduce((n, i) => n + i.quantity, 0) === 1 ? "item" : "items"}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <p className="text-base font-bold text-ink">{money(o.totalCents)}</p>
                  <Link
                    href={`/orders/${o.id}`}
                    className="btn-ghost !py-2 !px-4 !text-xs font-semibold"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommended for Account */}
      {picks.length > 0 && (
        <section className="space-y-6 pt-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
              Tailored For You
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-display text-ink">Recommended Garments</h2>
            <p className="text-xs text-charcoal/60 mt-0.5">
              Suggestions based on your favorite silhouettes, sizes, and order records.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-4">
            {picks.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

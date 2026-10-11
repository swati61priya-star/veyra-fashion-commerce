import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requirePageUser } from "@/lib/auth";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";

export default async function Admin() {
  const user = await requirePageUser("/admin");
  if (user.role !== "ADMIN") notFound(); // server-side role check; API routes re-check too
  const [products, orders, users] = await Promise.all([
    db.product.findMany({ orderBy: { createdAt: "desc" } }),
    db.order.findMany({ orderBy: { createdAt: "desc" }, include: { user: { select: { email: true } } } }),
    db.user.count(),
  ]);
  return (
    <div className="container-v py-10">
      <h1 className="text-4xl">Admin dashboard</h1>
      <dl className="my-8 grid grid-cols-3 gap-4 text-center">
        {[["Products", products.length], ["Orders", orders.length], ["Customers", users]].map(([l, n]) => (
          <div key={l} className="border border-ink/10 bg-white py-5"><dd className="font-display text-3xl">{n}</dd><dt className="text-xs uppercase tracking-widest text-charcoal/60">{l}</dt></div>
        ))}
      </dl>
      <AdminPanel
        products={products.map((p) => ({ id: p.id, name: p.name, priceCents: p.priceCents, stock: p.stock, category: p.category, gender: p.gender }))}
        orders={orders.map((o) => ({ id: o.id, status: o.status, totalCents: o.totalCents, createdAt: o.createdAt.toISOString(), email: o.user.email }))}
      />
    </div>
  );
}

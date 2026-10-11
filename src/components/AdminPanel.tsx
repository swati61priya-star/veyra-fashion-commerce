"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { call } from "@/lib/client";
import { money } from "@/lib/format";

type P = { id: string; name: string; priceCents: number; stock: number; category: string; gender: string };
type O = { id: string; status: string; totalCents: number; createdAt: string; email: string };
const STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

function ProductRow({ p }: { p: P }) {
  const router = useRouter();
  const [price, setPrice] = useState((p.priceCents / 100).toFixed(2));
  const [stock, setStock] = useState(String(p.stock));
  const [msg, setMsg] = useState("");
  async function save() {
    const r = await call(`/api/admin/products/${p.id}`, "PATCH", { priceCents: Math.round(parseFloat(price) * 100), stock: parseInt(stock, 10) });
    setMsg(r.ok ? "Saved" : r.error ?? "Error");
    if (r.ok) router.refresh();
  }
  async function del() {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const r = await call(`/api/admin/products/${p.id}`, "DELETE");
    if (r.ok) router.refresh(); else setMsg(r.error ?? "Error");
  }
  return (
    <tr className="border-b border-ink/10 align-middle">
      <td className="py-2 pr-3">{p.name}<div className="text-xs text-charcoal/60">{p.gender} · {p.category}</div></td>
      <td className="pr-3"><input aria-label="Price" className="input w-24" value={price} onChange={(e) => setPrice(e.target.value)} /></td>
      <td className="pr-3"><input aria-label="Stock" className="input w-20" value={stock} onChange={(e) => setStock(e.target.value)} /></td>
      <td className="space-x-3 whitespace-nowrap">
        <button className="underline underline-offset-4" onClick={save}>Save</button>
        <button className="text-red-700 underline underline-offset-4" onClick={del}>Delete</button>
        <span className="text-xs text-charcoal/60">{msg}</span>
      </td>
    </tr>
  );
}

function NewProduct() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const r = await call("/api/admin/products", "POST", {
      name: f.name, description: f.description, priceCents: Math.round(parseFloat(f.price) * 100),
      category: f.category, gender: f.gender, tags: f.tags, sizes: f.sizes, colors: f.colors,
      image: f.image || null, stock: parseInt(f.stock, 10),
    });
    setMsg(r.ok ? "Product created." : r.error ?? "Error");
    if (r.ok) { form.reset(); router.refresh(); }
  }
  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <input name="name" placeholder="Name" required className="input" />
      <input name="price" placeholder="Price (Rs)" required className="input" />
      <select name="category" className="input"><option>Tops</option><option>Bottoms</option><option>Outerwear</option><option>Dresses</option><option>Sets</option><option>Kurtas</option><option>Sarees</option><option>Ethnic Wear</option><option>Accessories</option><option>Shoes</option><option>Bags</option></select>
      <select name="gender" className="input"><option>Unisex</option><option>Men</option><option>Women</option><option>Kids</option></select>
      <input name="sizes" placeholder="Sizes, comma separated (S,M,L)" required className="input" />
      <input name="colors" placeholder="Colors, comma separated" required className="input" />
      <input name="tags" placeholder="Tags, comma separated" className="input" />
      <input name="stock" placeholder="Stock" required className="input" />
      <input name="image" placeholder="Image path or URL (optional, e.g. /products/shirt.jpg)" className="input sm:col-span-2" />
      <textarea name="description" placeholder="Description" required className="input sm:col-span-2" rows={3} />
      <div className="sm:col-span-2 flex items-center gap-4"><button className="btn">Create product</button><span role="status" className="text-sm">{msg}</span></div>
    </form>
  );
}

function OrderRow({ o }: { o: O }) {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  async function change(status: string) {
    const r = await call(`/api/admin/orders/${o.id}`, "PATCH", { status });
    setMsg(r.ok ? "Updated" : r.error ?? "Error");
    if (r.ok) router.refresh();
  }
  return (
    <tr className="border-b border-ink/10">
      <td className="py-2 pr-3 font-mono text-xs">{o.id.slice(-8)}</td>
      <td className="pr-3">{o.email}</td>
      <td className="pr-3">{money(o.totalCents)}</td>
      <td className="pr-3">{new Date(o.createdAt).toLocaleDateString()}</td>
      <td><select className="input !w-auto" defaultValue={o.status} onChange={(e) => change(e.target.value)}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select> <span className="text-xs">{msg}</span></td>
    </tr>
  );
}

export default function AdminPanel({ products, orders }: { products: P[]; orders: O[] }) {
  return (
    <div className="space-y-14">
      <section><h2 className="mb-4 text-2xl">Add product</h2><NewProduct /></section>
      <section>
        <h2 className="mb-4 text-2xl">Inventory</h2>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-widest text-charcoal/60"><tr><th className="pb-2">Product</th><th>Price (Rs)</th><th>Stock</th><th /></tr></thead>
          <tbody>{products.map((p) => <ProductRow key={p.id} p={p} />)}</tbody>
        </table></div>
      </section>
      <section>
        <h2 className="mb-4 text-2xl">Orders</h2>
        {orders.length === 0 ? <p className="text-sm text-charcoal/70">No orders yet.</p> : (
          <div className="overflow-x-auto"><table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-widest text-charcoal/60"><tr><th className="pb-2">Order</th><th>Customer</th><th>Total</th><th>Date</th><th>Status</th></tr></thead>
            <tbody>{orders.map((o) => <OrderRow key={o.id} o={o} />)}</tbody>
          </table></div>
        )}
      </section>
    </div>
  );
}

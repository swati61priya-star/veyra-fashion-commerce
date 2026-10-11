"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductImage from "./ProductImage";
import { call } from "@/lib/client";
import { money } from "@/lib/format";

type Item = {
  id: string;
  quantity: number;
  size: string;
  color: string;
  product: {
    slug: string;
    name: string;
    priceCents: number;
    image: string | null;
    category: string;
    stock: number;
  };
};

export default function CartRow({ item }: { item: Item }) {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [updating, setUpdating] = useState(false);

  async function update(q: number) {
    if (updating) return;
    setErr("");
    setUpdating(true);
    const r = await call("/api/cart", "PATCH", { itemId: item.id, quantity: q });
    setUpdating(false);
    if (!r.ok) return setErr(r.error ?? "Failed to update quantity");
    router.refresh();
  }

  async function remove() {
    if (updating) return;
    setUpdating(true);
    await call("/api/cart", "DELETE", { itemId: item.id });
    setUpdating(false);
    router.refresh();
  }

  const p = item.product;

  return (
    <li className="flex gap-4 sm:gap-6 border-b border-ink/10 py-6">
      {/* Product Image */}
      <Link
        href={`/product/${p.slug}`}
        className="h-32 w-24 sm:h-36 sm:w-28 shrink-0 overflow-hidden rounded-2xl bg-sand/40 border border-ink/5"
      >
        <ProductImage
          src={p.image}
          name={p.name}
          category={p.category}
          color={item.color}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>

      {/* Details & Controls */}
      <div className="flex flex-1 flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link
              href={`/product/${p.slug}`}
              className="font-display text-lg sm:text-xl text-ink hover:text-terracotta transition-colors"
            >
              {p.name}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-charcoal/70">
              <span className="rounded-md bg-sand/60 px-2 py-0.5 font-medium">Size {item.size}</span>
              <span>·</span>
              <span>{item.color}</span>
            </div>
          </div>
          <p className="font-semibold text-ink sm:text-lg">
            {money(p.priceCents * item.quantity)}
          </p>
        </div>

        {/* Quantity Controls & Remove */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center rounded-full border border-ink/20 bg-white">
            <button
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center text-charcoal disabled:opacity-30 hover:text-ink font-semibold"
              disabled={item.quantity <= 1 || updating}
              onClick={() => update(item.quantity - 1)}
            >
              −
            </button>
            <span className="w-8 text-center text-xs font-bold text-ink">
              {item.quantity}
            </span>
            <button
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-charcoal disabled:opacity-30 hover:text-ink font-semibold"
              disabled={item.quantity >= Math.min(10, p.stock) || updating}
              onClick={() => update(item.quantity + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            onClick={remove}
            disabled={updating}
            className="text-xs uppercase tracking-wider text-charcoal/60 hover:text-red-700 underline underline-offset-4 transition-colors"
          >
            Remove
          </button>
        </div>

        {err && <p className="mt-2 text-xs text-red-700">{err}</p>}
      </div>
    </li>
  );
}

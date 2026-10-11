"use client";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { call } from "@/lib/client";

type Props = {
  productId: string;
  sizes: string[];
  colors: string[];
  color: string;
  onColor: (c: string) => void;
  stock: number;
  loggedIn: boolean;
  wished: boolean;
};

export default function AddToCart({
  productId,
  sizes,
  colors,
  color,
  onColor,
  stock,
  loggedIn,
  wished: w0,
}: Props) {
  const router = useRouter();
  const path = usePathname();
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [wished, setWished] = useState(w0);
  const [busy, setBusy] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const login = () => router.push(`/login?next=${encodeURIComponent(path)}`);

  async function add() {
    if (!loggedIn) return login();
    if (!size) {
      setMsg({ ok: false, text: "Please select a size to continue." });
      return;
    }
    setBusy(true);
    const r = await call("/api/cart", "POST", { productId, size, color, quantity });
    setBusy(false);
    if (r.ok) {
      setMsg({ ok: true, text: `Added ${quantity} ${quantity === 1 ? "item" : "items"} to your cart.` });
      router.refresh();
    } else {
      setMsg({ ok: false, text: r.error ?? "Failed to add to cart" });
    }
  }

  async function toggleWish() {
    if (!loggedIn) return login();
    const r = await call("/api/wishlist", "POST", { productId });
    if (r.ok) {
      setWished(r.data.wished);
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      {/* Color Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="label !mb-0">
            Selected Color · <span className="normal-case tracking-normal font-semibold text-ink">{color}</span>
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onColor(c)}
              aria-pressed={c === color}
              className={`rounded-full border px-4 py-2 text-xs font-medium transition-all ${
                c === color
                  ? "border-ink bg-ink text-white shadow-sm"
                  : "border-ink/20 bg-white text-charcoal hover:border-ink hover:bg-sand/30"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="label !mb-0">
            Size · <span className="normal-case tracking-normal font-semibold text-ink">{size || "Select a size"}</span>
          </span>
          <button
            type="button"
            onClick={() => setShowSizeGuide(!showSizeGuide)}
            className="text-[11px] uppercase tracking-wider text-charcoal/60 underline underline-offset-4 hover:text-ink"
          >
            Size Guide
          </button>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSize(s);
                setMsg(null);
              }}
              aria-pressed={s === size}
              className={`min-w-12 rounded-xl border py-2.5 px-3.5 text-center text-xs font-medium transition-all ${
                s === size
                  ? "border-ink bg-ink text-white shadow-sm"
                  : "border-ink/15 bg-white text-charcoal hover:border-ink hover:bg-sand/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Sizing Modal / Dropdown */}
        {showSizeGuide && (
          <div className="mt-3 rounded-xl border border-ink/10 bg-sand/40 p-3.5 text-xs text-charcoal/80">
            <p className="font-semibold text-ink">Fit & Measurements</p>
            <p className="mt-1">
              Fits true to size. For an oversized relaxed fit, we suggest sizing up one size. All garments are pre-shrunk.
            </p>
          </div>
        )}
      </div>

      {/* Quantity & Add to Cart Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center rounded-full border border-ink/20 bg-white px-2 py-1">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-charcoal disabled:opacity-30 hover:text-ink"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-ink">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              disabled={quantity >= Math.min(10, stock)}
              onClick={() => setQuantity((q) => Math.min(Math.min(10, stock), q + 1))}
              className="flex h-8 w-8 items-center justify-center text-sm font-semibold text-charcoal disabled:opacity-30 hover:text-ink"
            >
              +
            </button>
          </div>

          {/* Primary CTA */}
          <button
            type="button"
            className="btn flex-1 !py-3.5 !text-sm !font-semibold shadow-md"
            disabled={busy || stock === 0}
            onClick={add}
          >
            {stock === 0 ? "Sold Out" : busy ? "Adding to Cart…" : `Add to Cart · ${quantity}`}
          </button>

          {/* Wishlist Button */}
          <button
            type="button"
            className={`flex h-12 w-12 items-center justify-center rounded-full border transition-all ${
              wished
                ? "border-terracotta bg-terracotta/10 text-terracotta shadow-sm"
                : "border-ink/20 bg-white text-charcoal hover:border-ink hover:text-ink"
            }`}
            onClick={toggleWish}
            aria-pressed={wished}
            aria-label={wished ? "Saved in wishlist" : "Save to wishlist"}
          >
            <svg
              className={`h-5 w-5 ${wished ? "fill-terracotta" : "fill-none"}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Feedback Messages */}
        {msg && (
          <div
            role="status"
            className={`rounded-xl px-4 py-3 text-xs font-medium flex items-center justify-between ${
              msg.ok ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            <span>{msg.text}</span>
            {msg.ok && (
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="underline font-semibold ml-2 hover:text-green-950"
              >
                View cart →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Assurance Icons / Perks */}
      <div className="rounded-2xl border border-ink/10 bg-sand/30 p-4 space-y-2 text-xs text-charcoal/80">
        <div className="flex items-center gap-2.5">
          <svg className="h-4 w-4 text-terracotta shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>Free express delivery on orders over ₹3,999</span>
        </div>
        <div className="flex items-center gap-2.5">
          <svg className="h-4 w-4 text-terracotta shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Complimentary 7-day returns & exchanges</span>
        </div>
        <div className="flex items-center gap-2.5">
          <svg className="h-4 w-4 text-terracotta shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>Simulated secure checkout · Demo store</span>
        </div>
      </div>
    </div>
  );
}

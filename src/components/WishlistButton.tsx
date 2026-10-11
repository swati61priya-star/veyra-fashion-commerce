"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { call } from "@/lib/client";

export default function WishlistButton({
  productId,
  initialWished = false,
  className = "",
}: {
  productId: string;
  initialWished?: boolean;
  className?: string;
}) {
  const router = useRouter();
  const [wished, setWished] = useState(initialWished);
  const [busy, setBusy] = useState(false);

  async function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const r = await call("/api/wishlist", "POST", { productId });
    setBusy(false);
    if (r.ok) {
      setWished(r.data.wished);
      router.refresh();
    } else {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95 ${className}`}
    >
      <svg
        className={`h-4 w-4 transition-colors ${wished ? "fill-terracotta text-terracotta" : "fill-none text-charcoal hover:text-ink"}`}
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
  );
}

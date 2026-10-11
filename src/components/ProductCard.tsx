import Link from "next/link";
import ProductImage from "./ProductImage";
import WishlistButton from "./WishlistButton";
import { money, split } from "@/lib/format";

type P = {
  id?: string;
  slug: string;
  name: string;
  priceCents: number;
  image: string | null;
  category: string;
  gender: string;
  stock: number;
  colors: string;
  tags?: string;
};

export default function ProductCard({
  p,
  priority = false,
}: {
  p: P;
  priority?: boolean;
}) {
  const colors = split(p.colors);
  const isNew = p.tags?.includes("featured") || p.tags?.includes("summer") || p.tags?.includes("autumn");
  const isBestseller = p.tags?.includes("bestseller");

  return (
    <div className="group relative flex flex-col">
      <Link href={`/product/${p.slug}`} className="block overflow-hidden rounded-2xl bg-sand/40">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <div className="h-full w-full transition duration-700 ease-out group-hover:scale-105">
            <ProductImage
              src={p.image}
              name={p.name}
              category={p.category}
              color={colors[0]}
              priority={priority}
            />
          </div>

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 pointer-events-none">
            {p.stock === 0 ? (
              <span className="rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm">
                Sold out
              </span>
            ) : p.stock > 0 && p.stock <= 5 ? (
              <span className="rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-terracotta shadow-sm">
                Only {p.stock} left
              </span>
            ) : isBestseller ? (
              <span className="rounded-full bg-ink/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white shadow-sm backdrop-blur">
                Bestseller
              </span>
            ) : isNew ? (
              <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-ink shadow-sm backdrop-blur">
                New
              </span>
            ) : null}
          </div>
        </div>
      </Link>

      {/* Quick Wishlist Action */}
      {p.id && (
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton productId={p.id} />
        </div>
      )}

      {/* Product Details */}
      <div className="mt-3.5 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${p.slug}`} className="min-w-0">
            <h3 className="truncate font-sans text-[15px] font-medium text-ink transition-colors group-hover:text-terracotta">
              {p.name}
            </h3>
            <p className="mt-0.5 text-xs text-charcoal/60">
              {p.gender} · {p.category}
            </p>
          </Link>
          <p className="shrink-0 font-sans text-[15px] font-semibold text-ink">
            {money(p.priceCents)}
          </p>
        </div>

        {/* Color Count Indicator */}
        <div className="mt-2 flex items-center justify-between text-[11px] text-charcoal/50">
          <span>{colors.length} {colors.length === 1 ? "colorway" : "colorways"}</span>
          <span className="text-[10px] uppercase tracking-wider text-charcoal/40 group-hover:text-charcoal transition-colors">
            Quick view →
          </span>
        </div>
      </div>
    </div>
  );
}

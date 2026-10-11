import Link from "next/link";
import { db } from "@/lib/db";
import { requirePageUser } from "@/lib/auth";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Wishlist() {
  const user = await requirePageUser("/wishlist");
  const items = await db.wishlistItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-v py-10 lg:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-ink/10 pb-6 gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-terracotta">
            Saved For Later
          </span>
          <h1 className="mt-1 text-4xl font-display text-ink">My Wishlist</h1>
          <p className="mt-1 text-sm text-charcoal/60">
            {items.length} {items.length === 1 ? "garment" : "garments"} saved in your private collection
          </p>
        </div>
        {items.length > 0 && (
          <Link
            href="/shop"
            className="text-xs uppercase tracking-wider text-charcoal hover:text-ink underline underline-offset-4"
          >
            Continue browsing
          </Link>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink/20 bg-white/70 py-20 px-6 text-center max-w-xl mx-auto space-y-5">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand/60 text-charcoal/60">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-display text-ink">Your wishlist is empty</h2>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Save pieces as you browse by clicking the heart icon on any garment card or product page.
          </p>
          <div className="pt-2">
            <Link href="/shop" className="btn !py-3.5 !px-8">
              Explore The Catalog →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-4">
          {items.map((i) => (
            <ProductCard key={i.id} p={i.product} />
          ))}
        </div>
      )}
    </div>
  );
}

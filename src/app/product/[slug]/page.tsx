import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { split, money } from "@/lib/format";
import { recommend } from "@/lib/recommend";
import ProductView from "@/components/ProductView";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await db.product.findUnique({ where: { slug: params.slug } });
  if (!p) notFound();

  const user = await getUser();
  const wished = user
    ? !!(await db.wishlistItem.findUnique({
        where: { userId_productId: { userId: user.id, productId: p.id } },
      }))
    : false;

  const allOther = await db.product.findMany({ where: { id: { not: p.id }, image: { not: null } } });
  const related = recommend(allOther, [p], { limit: 4 });

  const isLowStock = p.stock > 0 && p.stock <= 5;
  const isSoldOut = p.stock === 0;

  return (
    <div className="container-v py-8 lg:py-12">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs text-charcoal/60">
        <Link href="/" className="hover:text-ink transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
        <span>/</span>
        <Link href={`/shop?cat=${p.gender}`} className="hover:text-ink transition-colors">{p.gender}</Link>
        <span>/</span>
        <Link href={`/shop?cat=${p.category}`} className="hover:text-ink transition-colors">{p.category}</Link>
        <span>/</span>
        <span className="font-medium text-ink truncate max-w-xs">{p.name}</span>
      </nav>

      <ProductView
        product={{
          id: p.id,
          name: p.name,
          category: p.category,
          image: p.image,
          stock: p.stock,
        }}
        sizes={split(p.sizes)}
        colors={split(p.colors)}
        loggedIn={!!user}
        wished={wished}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="badge badge-terracotta">{p.gender} Collection</span>
            <span className="text-xs uppercase tracking-widest text-charcoal/50">· {p.category}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl leading-tight text-ink font-normal font-display">
            {p.name}
          </h1>

          <div className="flex items-baseline gap-4 pt-1">
            <p className="text-3xl font-semibold text-ink">
              {money(p.priceCents)}
            </p>
            <span className="text-xs text-charcoal/60">All taxes included</span>
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2 text-xs font-medium pt-1">
            {isSoldOut ? (
              <span className="text-charcoal/60">● Currently out of stock</span>
            ) : isLowStock ? (
              <span className="text-terracotta font-semibold animate-pulse">● Only {p.stock} units remaining</span>
            ) : (
              <span className="text-emerald-800">● In stock · Ready for dispatch</span>
            )}
          </div>

          <p className="pt-3 text-[15px] leading-relaxed text-charcoal/80">
            {p.description}
          </p>
        </div>
      </ProductView>

      {/* Recommended / Related Products */}
      {related.length > 0 && (
        <section className="mt-24 border-t border-ink/10 pt-16">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">Curated Recommendations</p>
              <h2 className="mt-2 text-3xl sm:text-4xl">Complete the look</h2>
            </div>
            <Link href="/shop" className="text-xs font-medium uppercase tracking-wider text-charcoal hover:text-ink underline underline-offset-4">
              View all garments →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {related.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

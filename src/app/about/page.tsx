import Link from "next/link";
import ProductImage from "@/components/ProductImage";

export default function AboutPage() {
  return (
    <div className="container-v py-12 lg:py-20 space-y-16">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="badge badge-terracotta">Our Heritage</span>
        <h1 className="text-4xl sm:text-6xl font-display text-ink leading-tight">
          Thoughtful garments,<br />
          <em className="font-light italic text-terracotta">enduring character.</em>
        </h1>
        <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed pt-2">
          VEYRA was founded on a simple principle: clothing should be made to last, crafted from natural fabrics, and designed to move seamlessly with the rhythm of everyday life.
        </p>
      </div>

      {/* Visual Showcase */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-sand/40 border border-ink/5">
          <ProductImage
            src="/products/floral-tiered-sundress-1.jpg"
            name="Women's Pure Cotton Sundress"
            category="Dresses"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-sand/40 border border-ink/5">
          <ProductImage
            src="/products/men-chore-jacket-1.png"
            name="Heavyweight Canvas Workwear"
            category="Outerwear"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="aspect-[3/4] overflow-hidden rounded-3xl bg-sand/40 border border-ink/5 sm:col-span-2 lg:col-span-1">
          <ProductImage
            src="/products/kids-polka-set-1.jpg"
            name="Kids Soft Coordinates"
            category="Sets"
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Values Grid */}
      <div className="grid gap-8 sm:grid-cols-3 border-t border-ink/10 pt-12">
        <div className="space-y-3">
          <p className="font-display text-2xl text-ink">01. Natural Materials</p>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            We prioritize biodegradable, skin-friendly European linens, certified organic cottons, and fine merino wools. No synthetic fillers or cheap poly-blends.
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-display text-2xl text-ink">02. Modern Silhouette</p>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Relaxed tailoring, camp collars, fluid pleats, and generous cuts. Our garments are intentionally proportioned for ease and quiet confidence.
          </p>
        </div>
        <div className="space-y-3">
          <p className="font-display text-2xl text-ink">03. Honest Ethics</p>
          <p className="text-sm text-charcoal/70 leading-relaxed">
            Transparent batch production, fair artisan wages, pre-shrunk testing, and enduring craftsmanship that stays in your wardrobe year after year.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-3xl bg-ink text-white p-8 sm:p-14 text-center space-y-4">
        <h2 className="text-3xl sm:text-4xl font-display text-white">Experience The Collection</h2>
        <p className="text-sm text-white/70 max-w-md mx-auto">
          Explore our seasonal men&apos;s, women&apos;s, and kids&apos; arrivals crafted in natural fibers.
        </p>
        <div className="pt-2">
          <Link href="/shop" className="btn !bg-white !text-ink hover:!bg-sand">
            Explore All Garments →
          </Link>
        </div>
      </div>
    </div>
  );
}

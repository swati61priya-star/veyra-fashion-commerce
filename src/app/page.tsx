import Link from "next/link";
import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { split, money } from "@/lib/format";
import { recommend } from "@/lib/recommend";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";

export const dynamic = "force-dynamic";

const perks = [
  {
    title: "Complimentary Express Delivery",
    desc: "On every order over ₹3,999 across India",
    icon: (
      <svg className="h-6 w-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
  {
    title: "7-Day Hassle-Free Returns",
    desc: "Effortless size exchanges & return pickup",
    icon: (
      <svg className="h-6 w-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: "Pure Sustainable Fabrics",
    desc: "European linen, organic cotton & fine wool",
    icon: (
      <svg className="h-6 w-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
  },
  {
    title: "Simulated Secure Checkout",
    desc: "Transparent shopping experience without risk",
    icon: (
      <svg className="h-6 w-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

export default async function Home() {
  const [all, user] = await Promise.all([
    db.product.findMany({ where: { image: { not: null } }, orderBy: { createdAt: "desc" } }),
    getUser(),
  ]);

  // Specific flagship pieces featuring user's uploaded assets
  const floralDress = all.find((p) => p.slug.includes("floral") || p.name.includes("Floral")) ?? all[0];
  const choreJacket = all.find((p) => p.slug.includes("chore") || p.name.includes("Chore")) ?? all[1];
  const kidsSet = all.find((p) => p.slug.includes("polka") || p.category === "Sets" || p.gender === "Kids") ?? all[2];
  const toteBag = all.find((p) => p.slug.includes("tote") || p.name.includes("Tote")) ?? all[3];

  const newArrivals = all.slice(0, 8);
  const bestsellers = all.filter((p) => p.tags.includes("bestseller")).slice(0, 4);

  let picks: typeof all = [];
  if (user) {
    const [cart, wish, ordered] = await Promise.all([
      db.cartItem.findMany({ where: { userId: user.id }, include: { product: true } }),
      db.wishlistItem.findMany({ where: { userId: user.id }, include: { product: true } }),
      db.orderItem.findMany({ where: { order: { userId: user.id } }, include: { product: true }, take: 20 }),
    ]);
    const seeds = [
      ...cart.map((c) => c.product),
      ...wish.map((w) => w.product),
      ...ordered.flatMap((o) => (o.product ? [o.product] : [])),
    ];
    picks = recommend(all, seeds, { limit: 4 });
  }

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. Pinterest Inspired Hero Stage */}
      <section className="container-v pt-6 sm:pt-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#2D241E] via-[#241C17] to-[#15100D] text-white p-6 sm:p-12 lg:p-16 shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-terracotta/25 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-amber/20 blur-3xl" />

          {/* Top Pill Navigation inside Hero (Direct from Pinterest inspiration) */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="flex flex-wrap items-center gap-2 rounded-full bg-white/10 p-1.5 backdrop-blur-md">
              <Link href="/shop?cat=Outerwear" className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-ink shadow-sm">
                Chore Jacket
              </Link>
              <Link href="/shop?cat=Dresses" className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors">
                Sundresses
              </Link>
              <Link href="/shop?cat=Kids" className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors">
                Kids Coordinates
              </Link>
              <Link href="/shop" className="rounded-full px-4 py-1.5 text-xs font-medium text-white/80 hover:text-white transition-colors">
                All Products
              </Link>
            </div>

            <div className="flex items-center gap-2 text-xs tracking-widest text-white/60 uppercase">
              <span>Collection 2026</span>
              <span>·</span>
              <span className="text-terracotta font-semibold">New Arrivals</span>
            </div>
          </div>

          {/* Hero Main Content Grid */}
          <div className="relative z-10 grid items-center gap-10 pt-10 lg:grid-cols-12 lg:gap-8">
            {/* Left Copy & CTA */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-terracotta/30 bg-terracotta/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-widest text-terracotta-light">
                Official Signature Collection
              </div>

              <h1 className="text-5xl font-normal leading-[1.05] sm:text-7xl lg:text-[76px] tracking-tight text-white font-display">
                Stand out <br />
                <span className="italic font-display font-light text-terracotta-light">without trying.</span>
              </h1>

              <p className="max-w-lg text-[16px] sm:text-[18px] leading-relaxed text-white/75 font-normal">
                Carefully crafted silhouettes in pure linen, organic cotton, and rich canvas. Built with effortless ease for everyday confidence and enduring style.
              </p>

              {/* Interactive Sizing Pills (Pinterest style) */}
              <div className="pt-2 space-y-2">
                <p className="text-[11px] uppercase tracking-widest text-white/60">Select Your Size:</p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {["S", "M", "L", "XL"].map((sz, i) => (
                    <span
                      key={sz}
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        i === 1 ? "bg-white text-ink shadow-lg scale-105" : "bg-white/10 text-white/80 hover:bg-white/20"
                      }`}
                    >
                      {sz}
                    </span>
                  ))}
                  <span className="text-xs text-white/50 pl-2">Fits true to size</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  href={choreJacket ? `/product/${choreJacket.slug}` : "/shop"}
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold tracking-wide text-ink transition-all hover:bg-terracotta-light hover:text-white shadow-lg active:scale-95"
                >
                  <span>Get the look</span>
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/shop?cat=Women"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-7 py-4 text-sm font-medium text-white transition-all hover:border-white hover:bg-white/10 active:scale-95"
                >
                  Explore Women
                </Link>
              </div>
            </div>

            {/* Right Interactive Garment Showcase (Pinterest focal jacket) */}
            <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
              <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl bg-sand/10 border border-white/10 shadow-2xl backdrop-blur-sm group">
                {choreJacket && (
                  <ProductImage
                    src={choreJacket.image}
                    name={choreJacket.name}
                    category={choreJacket.category}
                    color="Espresso"
                    priority={true}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* Floating Price Tag */}
                <div className="absolute right-4 top-4 rounded-2xl bg-black/80 px-4 py-2.5 text-right backdrop-blur-md border border-white/10">
                  <p className="text-xl font-bold text-white">
                    {choreJacket ? money(choreJacket.priceCents) : "₹4,499"}
                  </p>
                  <p className="text-[11px] text-white/50 line-through">₹5,999</p>
                </div>

                {/* Bottom Slogan Badge */}
                <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-black/75 p-3.5 backdrop-blur-md border border-white/10">
                  <div>
                    <p className="text-xs font-semibold text-white">
                      {choreJacket?.name ?? "Espresso Canvas Chore Jacket"}
                    </p>
                    <p className="text-[10px] text-terracotta-light uppercase tracking-widest">
                      100% Heavyweight Cotton Canvas
                    </p>
                  </div>
                  <Link
                    href={choreJacket ? `/product/${choreJacket.slug}` : "/shop"}
                    className="rounded-full bg-white px-3.5 py-1.5 text-[11px] font-bold text-ink hover:bg-terracotta-light hover:text-white transition-colors"
                  >
                    View
                  </Link>
                </div>
              </div>

              {/* Mini Floating Secondary Preview Thumbnail (Pinterest bottom right switcher) */}
              {floralDress && (
                <Link
                  href={`/product/${floralDress.slug}`}
                  className="mt-4 flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white backdrop-blur-md transition-all hover:bg-white/20"
                >
                  <div className="h-8 w-8 overflow-hidden rounded-full bg-sand/30 shrink-0">
                    <ProductImage
                      src={floralDress.image}
                      name={floralDress.name}
                      category={floralDress.category}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span>Discover Floral Sundress Edition</span>
                  <span>→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Perks & Assurances Bar */}
      <section className="container-v">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 rounded-3xl border border-ink/10 bg-white p-8 shadow-sm">
          {perks.map((p) => (
            <div key={p.title} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sand/50">
                {p.icon}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-ink font-sans">{p.title}</h4>
                <p className="mt-1 text-xs text-charcoal/65 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Four Core Pillars: Women, Men, Kids, Accessories */}
      <section className="container-v">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">Explore The Pillars</p>
            <h2 className="mt-2 text-4xl sm:text-5xl">Shop by Category</h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-ink underline underline-offset-4">
            Browse Entire Catalog ({all.length} styles) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Women's Fashion (with uploaded Floral Sundress) */}
          <Link
            href="/shop?cat=Women"
            className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-sand/40 border border-ink/5 shadow-sm"
          >
            <div className="h-full w-full transition duration-700 ease-out group-hover:scale-105">
              {floralDress && (
                <ProductImage
                  src={floralDress.image}
                  name="Women's Collection"
                  category="Dresses"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white/95 px-5 py-4 text-sm font-semibold text-ink shadow-md backdrop-blur transition-all group-hover:bg-ink group-hover:text-white">
              <div>
                <p className="text-[11px] font-normal uppercase tracking-widest opacity-60">Spring & Summer</p>
                <p className="font-display text-base">Women&apos;s Collection</p>
              </div>
              <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>

          {/* 2. Men's Fashion (with uploaded Chore Jacket) */}
          <Link
            href="/shop?cat=Men"
            className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-sand/40 border border-ink/5 shadow-sm"
          >
            <div className="h-full w-full transition duration-700 ease-out group-hover:scale-105">
              {choreJacket && (
                <ProductImage
                  src={choreJacket.image}
                  name="Men's Collection"
                  category="Outerwear"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white/95 px-5 py-4 text-sm font-semibold text-ink shadow-md backdrop-blur transition-all group-hover:bg-ink group-hover:text-white">
              <div>
                <p className="text-[11px] font-normal uppercase tracking-widest opacity-60">Tailored & Street</p>
                <p className="font-display text-base">Men&apos;s Collection</p>
              </div>
              <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>

          {/* 3. Kids' Clothing (with uploaded Polka Dot set) */}
          <Link
            href="/shop?cat=Kids"
            className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-sand/40 border border-ink/5 shadow-sm"
          >
            <div className="h-full w-full transition duration-700 ease-out group-hover:scale-105">
              {kidsSet && (
                <ProductImage
                  src={kidsSet.image}
                  name="Kids' Collection"
                  category="Sets"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white/95 px-5 py-4 text-sm font-semibold text-ink shadow-md backdrop-blur transition-all group-hover:bg-ink group-hover:text-white">
              <div>
                <p className="text-[11px] font-normal uppercase tracking-widest opacity-60">Comfort & Play</p>
                <p className="font-display text-base">Kids&apos; Outfits</p>
              </div>
              <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>

          {/* 4. Accessories (with Canvas Tote) */}
          <Link
            href="/shop?cat=Accessories"
            className="group relative block aspect-[3/4] overflow-hidden rounded-3xl bg-sand/40 border border-ink/5 shadow-sm"
          >
            <div className="h-full w-full transition duration-700 ease-out group-hover:scale-105">
              {toteBag && (
                <ProductImage
                  src={toteBag.image}
                  name="Accessories"
                  category="Accessories"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <div className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl bg-white/95 px-5 py-4 text-sm font-semibold text-ink shadow-md backdrop-blur transition-all group-hover:bg-ink group-hover:text-white">
              <div>
                <p className="text-[11px] font-normal uppercase tracking-widest opacity-60">Leather & Canvas</p>
                <p className="font-display text-base">Accessories</p>
              </div>
              <span aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 4. New Arrivals Showcase */}
      <section className="container-v">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">Just Dropped</p>
            <h2 className="mt-2 text-4xl sm:text-5xl">New Season Arrivals</h2>
          </div>
          <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-ink underline underline-offset-4">
            View All ({newArrivals.length}) →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* 5. Editorial Banner: The Art of Dressing Well */}
      <section className="container-v">
        <div className="grid lg:grid-cols-12 gap-8 items-center rounded-[2.5rem] bg-sand/50 p-8 sm:p-14 border border-ink/10">
          <div className="lg:col-span-7 space-y-5">
            <span className="badge badge-terracotta">Editorial Feature</span>
            <h2 className="text-4xl sm:text-6xl leading-[1.08] text-ink font-display">
              Natural fibers.<br />
              <em className="font-light italic text-terracotta">Timeless cuts.</em>
            </h2>
            <p className="text-base sm:text-lg leading-relaxed text-charcoal/80 max-w-xl">
              At Veyra, we believe garments should feel as extraordinary as they look. That means zero polyester compromises: breathable European flax linen, fine organic cottons, and responsibly sheared wool.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link href="/shop?cat=Tops" className="btn">
                Discover Natural Tops
              </Link>
              <Link href="/about" className="btn-ghost">
                Our Sustainability Story
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-4">
            {all.slice(4, 6).map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="group aspect-[3/4] overflow-hidden rounded-2xl bg-white shadow-md block">
                <ProductImage src={p.image} name={p.name} category={p.category} className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Bestsellers Section */}
      {bestsellers.length > 0 && (
        <section className="container-v">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-terracotta">Most Coveted</p>
              <h2 className="mt-2 text-4xl sm:text-5xl">Bestsellers of the Season</h2>
            </div>
            <Link href="/shop" className="text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-ink underline underline-offset-4">
              Explore All →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Personalized "Picked for You" (Rule-based recommendations) */}
      {picks.length > 0 && (
        <section className="container-v">
          <div className="mb-8">
            <span className="badge badge-terracotta">Personalized For You</span>
            <h2 className="mt-2 text-4xl">Curated Suggestions</h2>
            <p className="mt-1 text-sm text-charcoal/65">
              Rule-based recommendations tailored to your recent browsing and wishlist.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
            {picks.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      )}

      {/* 8. VIP Newsletter & Community Club */}
      <section className="container-v">
        <div className="overflow-hidden rounded-[2.5rem] bg-ink text-white p-8 sm:p-16 text-center space-y-6">
          <p className="text-xs uppercase tracking-[0.3em] text-terracotta-light font-semibold">Join The Veyra Circle</p>
          <h2 className="text-4xl sm:text-6xl font-normal text-white max-w-2xl mx-auto">
            Receive 15% off your first simulated order.
          </h2>
          <p className="text-sm sm:text-base text-white/70 max-w-md mx-auto">
            Subscribe for private lookbook releases, seasonal previews, and mindful wardrobe styling notes.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 rounded-full bg-white/10 px-6 py-3.5 text-sm text-white placeholder:text-white/40 border border-white/20 outline-none focus:border-white focus:bg-white/20"
              required
            />
            <button
              type="button"
              className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-ink hover:bg-terracotta-light hover:text-white transition-colors"
            >
              Subscribe
            </button>
          </form>
          <p className="text-[11px] text-white/40">Demo store notification. No spam, ever.</p>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

type SP = {
  q?: string;
  cat?: string;
  min?: string;
  max?: string;
  sort?: string;
  color?: string;
  size?: string;
  instock?: string;
};

const GENDER_FILTERS = ["Men", "Women", "Kids"];
const CATEGORY_ORDER = ["Tops", "Bottoms", "Dresses", "Kurtas", "Sarees", "Ethnic Wear", "Sets", "Outerwear", "Shoes", "Bags", "Accessories"];

const hasToken = (list: string, wanted: string) =>
  list.split(",").some((t) => t.trim().toLowerCase() === wanted.trim().toLowerCase());

const POPULAR_COLORS = [
  "White",
  "Black",
  "Sand",
  "Beige",
  "Charcoal",
  "Olive",
  "Navy",
  "Indigo",
  "Ivory",
];

const POPULAR_SIZES = ["XS", "S", "M", "L", "XL", "28", "30", "32", "34", "36"];

export default async function Shop({ searchParams }: { searchParams: SP }) {
  const {
    q = "",
    cat = "",
    sort = "newest",
    color = "",
    size = "",
    instock = "",
  } = searchParams;

  const min = parseFloat(searchParams.min ?? "");
  const max = parseFloat(searchParams.max ?? "");

  const and: Prisma.ProductWhereInput[] = [];

  // 1. Text search: matches name, tags, category and gender (not free-form descriptions)
  for (const term of q.trim().split(/\s+/).filter(Boolean)) {
    and.push({
      OR: [
        { name: { contains: term } },
        { tags: { contains: term } },
        { category: { contains: term } },
        { gender: { contains: term } },
      ],
    });
  }

  // 2. Exact category / gender match. Men/Women/Kids also include Unisex items (not Kids).
  if (cat && cat !== "All") {
    if (GENDER_FILTERS.includes(cat)) {
      and.push({ gender: cat === "Kids" ? "Kids" : { in: [cat, "Unisex"] } });
    } else {
      and.push({ category: cat });
    }
  }

  // 3. Price Filter
  if (!isNaN(min)) and.push({ priceCents: { gte: Math.round(min * 100) } });
  if (!isNaN(max)) and.push({ priceCents: { lte: Math.round(max * 100) } });

  // 6. In Stock Filter
  if (instock === "true") {
    and.push({ stock: { gt: 0 } });
  }

  // Sorting
  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc"
      ? { priceCents: "asc" }
      : sort === "price-desc"
      ? { priceCents: "desc" }
      : sort === "name-asc"
      ? { name: "asc" }
      : { createdAt: "desc" };

  const found = await db.product.findMany({ where: { AND: [...and, { image: { not: null } }] }, orderBy });
  // Exact token match, so size "S" never matches "XS" and "L" never matches "XL".
  const products = found.filter(
    (p) => (!color || hasToken(p.colors, color) || p.colors.toLowerCase().includes(color.toLowerCase())) && (!size || hasToken(p.sizes, size)),
  );
  const present = await db.product.findMany({ where: { image: { not: null } }, select: { category: true } });
  const CATEGORIES = ["All", ...GENDER_FILTERS, ...CATEGORY_ORDER.filter((c) => present.some((x) => x.category === c))];

  // Active filters list for chips
  const activeFilters = [
    cat && cat !== "All" ? { key: "cat", label: `Category: ${cat}` } : null,
    q.trim() ? { key: "q", label: `Search: "${q.trim()}"` } : null,
    !isNaN(min) ? { key: "min", label: `Min ₹${min}` } : null,
    !isNaN(max) ? { key: "max", label: `Max ₹${max}` } : null,
    color ? { key: "color", label: `Color: ${color}` } : null,
    size ? { key: "size", label: `Size: ${size}` } : null,
    instock === "true" ? { key: "instock", label: "In Stock Only" } : null,
  ].filter(Boolean) as { key: string; label: string }[];

  return (
    <div className="container-v py-10 lg:py-14 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-terracotta font-semibold">
          <span>VEYRA Wardrobe Catalog</span>
          <span>·</span>
          <span>Authentic Natural Fibers</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-display text-ink">
          {cat && cat !== "All" ? cat : "All Garments & Essentials"}
        </h1>
        <p className="text-sm text-charcoal/70">
          Showing {products.length} {products.length === 1 ? "style" : "styles"}
          {q && ` matching “${q}”`}
        </p>
      </div>

      {/* Top Quick Category Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((c) => {
          const isActive = (c === "All" && (!cat || cat === "All")) || cat === c;
          return (
            <Link
              key={c}
              href={c === "All" ? "/shop" : `/shop?cat=${encodeURIComponent(c)}`}
              className={`rounded-full px-5 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                isActive
                  ? "bg-ink text-white shadow-sm"
                  : "bg-sand/60 text-charcoal hover:bg-sand hover:text-ink border border-ink/10"
              }`}
            >
              {c}
            </Link>
          );
        })}
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar Form */}
        <aside className="space-y-6">
          <form className="card space-y-6 self-start bg-white/90" method="get">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-ink">
                Refine Selection
              </h3>
              {activeFilters.length > 0 && (
                <Link href="/shop" className="text-xs text-terracotta hover:underline">
                  Reset All
                </Link>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label className="label" htmlFor="q">Keyword</label>
              <input
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Search linen, jacket, silk..."
                className="input"
              />
            </div>

            {/* Category / Gender Selector */}
            <div>
              <label className="label" htmlFor="cat">Category / Gender</label>
              <select id="cat" name="cat" defaultValue={cat} className="input">
                <option value="">All Categories</option>
                {CATEGORIES.filter((c) => c !== "All").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Color Selector */}
            <div>
              <label className="label" htmlFor="color">Color</label>
              <select id="color" name="color" defaultValue={color} className="input">
                <option value="">All Colors</option>
                {POPULAR_COLORS.map((clr) => (
                  <option key={clr} value={clr}>{clr}</option>
                ))}
              </select>
            </div>

            {/* Size Selector */}
            <div>
              <label className="label" htmlFor="size">Size</label>
              <select id="size" name="size" defaultValue={size} className="input">
                <option value="">All Sizes</option>
                {POPULAR_SIZES.map((sz) => (
                  <option key={sz} value={sz}>{sz}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="label">Price Range (₹)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="min"
                  name="min"
                  defaultValue={searchParams.min}
                  placeholder="Min"
                  inputMode="numeric"
                  className="input !py-2.5"
                />
                <input
                  id="max"
                  name="max"
                  defaultValue={searchParams.max}
                  placeholder="Max"
                  inputMode="numeric"
                  className="input !py-2.5"
                />
              </div>
            </div>

            {/* Stock Availability */}
            <div className="flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="instock"
                name="instock"
                value="true"
                defaultChecked={instock === "true"}
                className="h-4 w-4 rounded border-ink/20 text-terracotta focus:ring-terracotta"
              />
              <label htmlFor="instock" className="text-xs font-medium text-charcoal">
                In Stock Only
              </label>
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="label" htmlFor="sort">Sort By</label>
              <select id="sort" name="sort" defaultValue={sort} className="input">
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Alphabetical: A to Z</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn flex-1 !py-3 !text-xs font-semibold">
                Apply Filters
              </button>
              <Link href="/shop" className="btn-ghost !py-3 !px-4 !text-xs">
                Reset
              </Link>
            </div>
          </form>
        </aside>

        {/* Product Results */}
        <main className="space-y-6">
          {/* Active Filter Chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-sand/30 p-3 border border-ink/5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-charcoal/60 pl-1">
                Active:
              </span>
              {activeFilters.map((af) => (
                <span
                  key={af.key}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-medium text-ink shadow-sm border border-ink/10"
                >
                  {af.label}
                </span>
              ))}
              <Link
                href="/shop"
                className="ml-auto text-xs font-semibold text-terracotta hover:underline"
              >
                Clear all
              </Link>
            </div>
          )}

          {/* Results Grid */}
          {products.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-ink/20 bg-white/60 py-20 px-6 text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand/60 text-charcoal/60">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-ink">
                No matching garments found
              </h2>
              <p className="max-w-md mx-auto text-sm text-charcoal/70">
                Try loosening your filters, removing search terms, or explore our full collection of natural fabrics.
              </p>
              <div className="pt-2">
                <Link href="/shop" className="btn">
                  Reset All Filters
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
              {products.map((p, idx) => (
                <ProductCard key={p.id} p={p} priority={idx < 6} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

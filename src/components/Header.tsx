import Link from "next/link";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Logo from "./Logo";
import SignOutButton from "./SignOutButton";

const navLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Men", href: "/shop?cat=Men" },
  { label: "Women", href: "/shop?cat=Women" },
  { label: "Kids", href: "/shop?cat=Kids" },
  { label: "Dresses", href: "/shop?cat=Dresses" },
  { label: "Kurtas", href: "/shop?cat=Kurtas" },
  { label: "Bags", href: "/shop?cat=Bags" },
  { label: "Accessories", href: "/shop?cat=Accessories" },
];

export default async function Header() {
  const user = await getUser();

  let cartCount = 0;
  let wishCount = 0;

  if (user) {
    const [cartAgg, wishC] = await Promise.all([
      db.cartItem.aggregate({ where: { userId: user.id }, _sum: { quantity: true } }),
      db.wishlistItem.count({ where: { userId: user.id } }),
    ]);
    cartCount = cartAgg._sum.quantity ?? 0;
    wishCount = wishC;
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur-md transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-ink py-2 text-center text-[10px] font-medium tracking-[0.25em] text-white/90 sm:text-[11px]">
        <span>COMPLIMENTARY SHIPPING OVER ₹3,999</span>
        <span className="mx-2 opacity-40">·</span>
        <span>7-DAY HASSLE-FREE RETURNS</span>
        <span className="mx-2 hidden opacity-40 sm:inline">·</span>
        <span className="hidden sm:inline">OFFICIAL VEYRA STORE</span>
      </div>

      {/* Main Navigation */}
      <div className="container-v flex h-20 items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Logo size="md" />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-[13px] font-medium uppercase tracking-[0.14em] text-charcoal/80 transition-colors hover:text-ink hover:underline hover:underline-offset-8"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Icons & Search */}
        <div className="flex items-center gap-3 sm:gap-5">
          {/* Search Form */}
          <form action="/shop" method="get" className="relative hidden md:block">
            <input
              name="q"
              placeholder="Search garments..."
              aria-label="Search garments"
              className="w-44 rounded-full border border-ink/15 bg-white/80 py-2 pl-9 pr-4 text-xs text-ink placeholder:text-charcoal/40 transition-all focus:w-60 focus:border-ink focus:bg-white focus:outline-none"
            />
            <svg
              className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-charcoal/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </form>

          {/* Wishlist Link */}
          <Link
            href="/wishlist"
            aria-label={`Wishlist (${wishCount} items)`}
            className="relative flex items-center justify-center p-2 text-charcoal transition-colors hover:text-ink"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white">
                {wishCount}
              </span>
            )}
          </Link>

          {/* Cart Pill Button */}
          <Link
            href="/cart"
            aria-label={`Shopping Cart with ${cartCount} items`}
            className="flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium tracking-wide text-white transition hover:bg-charcoal active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Cart</span>
            <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[11px] font-bold">{cartCount}</span>
          </Link>

          {/* User Auth / Account */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/account"
                className="hidden items-center gap-2 rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-charcoal transition hover:border-ink hover:text-ink sm:flex"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-[10px] text-white">
                  {user.name[0]?.toUpperCase() ?? "U"}
                </span>
                <span className="max-w-20 truncate">{user.name.split(" ")[0]}</span>
              </Link>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="rounded-full bg-terracotta/10 px-2.5 py-1 text-[11px] font-semibold text-terracotta hover:bg-terracotta/20"
                >
                  Admin
                </Link>
              )}
              <div className="hidden sm:block">
                <SignOutButton />
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-wider text-charcoal hover:text-ink hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <nav className="container-v flex items-center gap-2 overflow-x-auto border-t border-ink/5 py-2.5 text-xs lg:hidden">
        {navLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="shrink-0 rounded-full bg-sand/60 px-3.5 py-1.5 font-medium text-charcoal transition hover:bg-sand hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
        {user && (
          <Link
            href="/account"
            className="shrink-0 rounded-full border border-ink/15 px-3.5 py-1.5 font-medium text-charcoal hover:border-ink"
          >
            My Account
          </Link>
        )}
      </nav>
    </header>
  );
}

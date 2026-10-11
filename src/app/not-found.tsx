import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-v py-32 text-center max-w-xl mx-auto space-y-5">
      <span className="badge badge-terracotta">404 Error</span>
      <h1 className="text-4xl sm:text-5xl font-display text-ink">Garment Not Found</h1>
      <p className="text-charcoal/70 text-sm leading-relaxed">
        The piece or page you are looking for may have been archived, renamed, or is temporarily unavailable.
      </p>
      <div className="pt-4 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className="btn">
          Explore All Garments →
        </Link>
        <Link href="/" className="btn-ghost">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

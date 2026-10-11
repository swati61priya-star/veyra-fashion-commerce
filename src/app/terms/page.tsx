export default function TermsPage() {
  return (
    <div className="container-v py-12 lg:py-20 max-w-3xl space-y-6">
      <span className="badge badge-terracotta">Legal Notice</span>
      <h1 className="text-4xl font-display text-ink">Terms of Service</h1>
      <div className="space-y-4 text-sm leading-relaxed text-charcoal/80 pt-4">
        <p>
          Welcome to VEYRA. By browsing or utilizing this demo e-commerce website, you acknowledge that VEYRA is a fictional portfolio concept built for demonstration purposes.
        </p>
        <h2 className="text-xl font-display text-ink pt-2">1. Demonstration Use</h2>
        <p>
          All transactions, orders, and payments placed on this website are simulated. No monetary charges are processed, and no real financial obligations are established.
        </p>
        <h2 className="text-xl font-display text-ink pt-2">2. Product Information</h2>
        <p>
          Product details, garments, and dimensions are curated representations. Imagery includes uploaded original brand assets and high-resolution catalog examples.
        </p>
        <h2 className="text-xl font-display text-ink pt-2">3. Intellectual Property</h2>
        <p>
          All trademarks, logos, and uploaded garment photographs remain the property of their respective creators.
        </p>
      </div>
    </div>
  );
}

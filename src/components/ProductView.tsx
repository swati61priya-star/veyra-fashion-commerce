"use client";
import { useState } from "react";
import ProductGallery from "./ProductGallery";
import AddToCart from "./AddToCart";

type Props = {
  product: { id: string; name: string; category: string; image: string | null; stock: number };
  sizes: string[];
  colors: string[];
  loggedIn: boolean;
  wished: boolean;
  children: React.ReactNode;
};

export default function ProductView({
  product,
  sizes,
  colors,
  loggedIn,
  wished,
  children,
}: Props) {
  const [color, setColor] = useState(colors[0] ?? "");
  const [activeTab, setActiveTab] = useState<"details" | "shipping" | "care">("details");

  // Parse multi-image strings (comma-separated)
  const imageList = product.image
    ? product.image
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
      {/* Gallery Section */}
      <ProductGallery
        images={imageList}
        name={product.name}
        category={product.category}
        selectedColor={color}
      />

      {/* Product Content & Buying Controls */}
      <div className="flex flex-col max-w-xl">
        {children}

        {/* Add to Cart Controls */}
        <div className="mt-8 border-t border-ink/10 pt-8">
          <AddToCart
            productId={product.id}
            sizes={sizes}
            colors={colors}
            color={color}
            onColor={setColor}
            stock={product.stock}
            loggedIn={loggedIn}
            wished={wished}
          />
        </div>

        {/* Product Accordion / Information Tabs */}
        <div className="mt-12 border-t border-ink/10 pt-8 space-y-4">
          <div className="flex gap-6 border-b border-ink/10 pb-3 text-xs font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`pb-3 -mb-3 transition-colors ${
                activeTab === "details" ? "border-b-2 border-ink text-ink font-bold" : "text-charcoal/50 hover:text-ink"
              }`}
            >
              Garment Details
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shipping")}
              className={`pb-3 -mb-3 transition-colors ${
                activeTab === "shipping" ? "border-b-2 border-ink text-ink font-bold" : "text-charcoal/50 hover:text-ink"
              }`}
            >
              Delivery & Returns
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("care")}
              className={`pb-3 -mb-3 transition-colors ${
                activeTab === "care" ? "border-b-2 border-ink text-ink font-bold" : "text-charcoal/50 hover:text-ink"
              }`}
            >
              Fabric & Care
            </button>
          </div>

          <div className="text-sm leading-relaxed text-charcoal/80 py-2">
            {activeTab === "details" && (
              <div className="space-y-2">
                <p>Expertly tailored with reinforced stress points, clean French seams, and natural mother-of-pearl buttons.</p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-charcoal/70">
                  <li>Relaxed contemporary silhouette</li>
                  <li>Ethically sourced and pre-shrunk</li>
                  <li>Designed in New Delhi, made to last a lifetime</li>
                </ul>
              </div>
            )}
            {activeTab === "shipping" && (
              <div className="space-y-2 text-xs">
                <p><strong>Complimentary Delivery:</strong> Orders over ₹3,999 ship free via express courier within 2-4 business days.</p>
                <p><strong>Standard Shipping:</strong> ₹149 flat rate for orders under ₹3,999.</p>
                <p><strong>7-Day Returns:</strong> Return or exchange unworn items with tags attached within 7 days of delivery.</p>
              </div>
            )}
            {activeTab === "care" && (
              <div className="space-y-2 text-xs">
                <p>Gentle cold wash with like colors using eco-friendly detergent. Line dry in shade to maintain fabric integrity. Warm iron on reverse if desired.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

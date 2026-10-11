import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import Logo from "@/components/Logo";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  title: "VEYRA — Modern Style. Your Way. | Luxury Fashion Store",
  description: "Experience premium fashion in natural fabrics: European flax linen, fine organic cottons, and rich canvas outerwear. Official Veyra online boutique.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col bg-ivory text-charcoal">
        <Header />
        <main className="flex-1">{children}</main>

        {/* Luxury Editorial Footer */}
        <footer className="mt-32 border-t border-ink/10 bg-ink text-white/80">
          <div className="container-v py-16 lg:py-20">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
              {/* Brand Col */}
              <div className="space-y-4 lg:col-span-2">
                <Logo size="md" light={true} />
                <p className="text-xs text-white/60 max-w-sm leading-relaxed">
                  Refined modern silhouettes in breathable European linen, fine organic cottons, and heirloom wools. Designed in New Delhi, made to last.
                </p>
                <div className="pt-2 flex items-center gap-3 text-xs text-white/50">
                  <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-medium text-white/70">
                    INR (₹) · India
                  </span>
                  <span>Free Shipping over ₹3,999</span>
                </div>
              </div>

              {/* Collections Col */}
              <div className="space-y-4 text-xs">
                <p className="font-semibold uppercase tracking-[0.2em] text-white">Collections</p>
                <ul className="space-y-2.5 text-white/60">
                  <li><Link href="/shop" className="hover:text-white transition-colors">All Garments</Link></li>
                  <li><Link href="/shop?cat=Women" className="hover:text-white transition-colors">Women&apos;s Boutique</Link></li>
                  <li><Link href="/shop?cat=Men" className="hover:text-white transition-colors">Men&apos;s Collection</Link></li>
                  <li><Link href="/shop?cat=Kids" className="hover:text-white transition-colors">Kids&apos; Coordinates</Link></li>
                  <li><Link href="/shop?cat=Accessories" className="hover:text-white transition-colors">Leather & Accessories</Link></li>
                </ul>
              </div>

              {/* Client Concierge Col */}
              <div className="space-y-4 text-xs">
                <p className="font-semibold uppercase tracking-[0.2em] text-white">Customer Care</p>
                <ul className="space-y-2.5 text-white/60">
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Concierge</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">Shipping & Returns FAQ</Link></li>
                  <li><Link href="/account" className="hover:text-white transition-colors">Track Order Status</Link></li>
                  <li><Link href="/wishlist" className="hover:text-white transition-colors">Saved Wishlist</Link></li>
                </ul>
              </div>

              {/* Company & Legal Col */}
              <div className="space-y-4 text-xs">
                <p className="font-semibold uppercase tracking-[0.2em] text-white">The Brand</p>
                <ul className="space-y-2.5 text-white/60">
                  <li><Link href="/about" className="hover:text-white transition-colors">Our Sustainability Story</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                  <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="mt-16 flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-8 gap-4 text-[11px] text-white/50">
              <p>© {new Date().getFullYear()} VEYRA Clothing Co. All rights reserved.</p>
              <p>Simulated fashion store demonstration. Secure transaction environment.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

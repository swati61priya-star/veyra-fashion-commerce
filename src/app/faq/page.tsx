import Link from "next/link";

const FAQS = [
  {
    q: "How does shipping work?",
    a: "We offer complimentary express shipping on all orders over ₹3,999 across India. For orders below ₹3,999, a flat shipping fee of ₹149 applies. Orders are typically dispatched within 24 hours and delivered in 2–4 business days.",
  },
  {
    q: "What is your return and exchange policy?",
    a: "We provide a 7-day hassle-free return and exchange policy on all unworn garments with original tags intact. In this demo store, returns are simulated without fees.",
  },
  {
    q: "How do I choose the right size?",
    a: "All Veyra garments are pre-shrunk and tailored to fit true to size. If you prefer a more relaxed or streetwear drape (for example, with our Canvas Chore Jacket), we recommend sizing up one size.",
  },
  {
    q: "Are the fabrics natural and sustainable?",
    a: "Yes. Our collection is made entirely with natural fibers: European flax linen, certified organic cotton, pure silk blends, and responsibly sourced merino wool. We avoid synthetic polyester blends.",
  },
  {
    q: "Is this a real store or a demo?",
    a: "This is a full-stack portfolio demonstration for the fictional brand VEYRA. No actual card payments are processed and checkout is simulated.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-v py-12 lg:py-20 space-y-12 max-w-3xl">
      <div className="space-y-3">
        <span className="badge badge-terracotta">Help & Clarity</span>
        <h1 className="text-4xl sm:text-5xl font-display text-ink">Frequently Asked Questions</h1>
        <p className="text-base text-charcoal/70">
          Everything you need to know about our natural garments, delivery, sizes, and returns.
        </p>
      </div>

      <div className="space-y-4">
        {FAQS.map((faq) => (
          <div key={faq.q} className="card bg-white p-6 space-y-2">
            <h3 className="font-display text-xl text-ink">{faq.q}</h3>
            <p className="text-sm text-charcoal/75 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-ink/10 bg-sand/30 p-6 text-center space-y-2">
        <p className="text-sm font-semibold text-ink">Still have a question?</p>
        <p className="text-xs text-charcoal/60">Our customer care team is always available to assist you.</p>
        <div className="pt-2">
          <Link href="/contact" className="btn !py-2.5 !px-6 !text-xs font-semibold">
            Contact Concierge →
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="container-v py-12 lg:py-20 space-y-12 max-w-4xl">
      <div className="space-y-3">
        <span className="badge badge-terracotta">Client Concierge</span>
        <h1 className="text-4xl sm:text-5xl font-display text-ink">We’re here to help.</h1>
        <p className="text-base text-charcoal/70">
          Have questions about sizing, fabric care, order tracking, or styling advice? Reach our dedicated concierge team.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {/* Contact Info Card */}
        <div className="card space-y-6 bg-white">
          <h2 className="text-xl font-display text-ink border-b border-ink/10 pb-3">
            Concierge Details
          </h2>
          <div className="space-y-4 text-xs text-charcoal/80">
            <div>
              <p className="font-semibold text-ink uppercase tracking-wider text-[11px]">Email</p>
              <p className="mt-1 font-mono text-sm">concierge@veyra.test</p>
            </div>
            <div>
              <p className="font-semibold text-ink uppercase tracking-wider text-[11px]">Hours</p>
              <p className="mt-1">Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
            </div>
            <div>
              <p className="font-semibold text-ink uppercase tracking-wider text-[11px]">Studio Address</p>
              <p className="mt-1">VEYRA Studios, 14 Hauz Khas Enclave, New Delhi 110016, India</p>
            </div>
            <div>
              <p className="font-semibold text-ink uppercase tracking-wider text-[11px]">Help Center</p>
              <p className="mt-1">
                Looking for instant answers? Check our{" "}
                <Link href="/faq" className="text-terracotta font-semibold underline">
                  Frequently Asked Questions
                </Link>
                .
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
             <form className="card space-y-4 bg-white" action="/contact">
          <h2 className="text-xl font-display text-ink border-b border-ink/10 pb-3">
            Send a Message
          </h2>
          <div>
            <label className="label" htmlFor="name">Your Name</label>
            <input id="name" placeholder="Full name" className="input" required />
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@example.com" className="input" required />
          </div>
          <div>
            <label className="label" htmlFor="subject">Subject</label>
            <select id="subject" className="input">
              <option>Order & Tracking Inquiry</option>
              <option>Size & Fit Recommendation</option>
              <option>Returns & Exchanges</option>
              <option>Press & Collaboration</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="msg">Message</label>
            <textarea id="msg" rows={3} placeholder="How can we assist you today?" className="input resize-none" required />
          </div>
          <button type="submit" className="btn w-full !py-3 text-xs font-semibold">
            Send Inquiry (Demo)
          </button>
        </form>
      </div>
    </div>
  );
}

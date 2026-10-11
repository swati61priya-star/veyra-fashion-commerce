"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { call } from "@/lib/client";

export default function CheckoutForm({ defaultName }: { defaultName: string }) {
  const router = useRouter();
  const key = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : String(Date.now()) + Math.random()
  );
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("upi");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setErr("");
    setBusy(true);
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const r = await call("/api/checkout", "POST", { ...f, idempotencyKey: key.current });
    if (!r.ok) {
      setBusy(false);
      return setErr(r.error ?? "Failed to place order");
    }
    router.push(`/orders/${r.data.orderId}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Step 1: Shipping Address */}
      <div className="card space-y-5 bg-white/95">
        <div className="flex items-center gap-3 border-b border-ink/10 pb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
            1
          </span>
          <h2 className="text-xl font-display text-ink">Shipping Destination</h2>
        </div>

        <div>
          <label className="label" htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            defaultValue={defaultName}
            required
            className="input"
            autoComplete="name"
          />
        </div>

        <div>
          <label className="label" htmlFor="address">Street Address / Landmark</label>
          <input
            id="address"
            name="address"
            required
            placeholder="e.g. 42 Bloom Boulevard, Apartment 3B"
            className="input"
            autoComplete="street-address"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label" htmlFor="city">City / District</label>
            <input
              id="city"
              name="city"
              required
              placeholder="e.g. New Delhi"
              className="input"
              autoComplete="address-level2"
            />
          </div>
          <div>
            <label className="label" htmlFor="postal">PIN / Postal Code</label>
            <input
              id="postal"
              name="postal"
              required
              placeholder="e.g. 110001"
              className="input"
              autoComplete="postal-code"
            />
          </div>
        </div>
      </div>

      {/* Step 2: Payment Simulation */}
      <div className="card space-y-5 bg-white/95">
        <div className="flex items-center gap-3 border-b border-ink/10 pb-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">
            2
          </span>
          <h2 className="text-xl font-display text-ink">Simulated Payment Method</h2>
        </div>

        <p className="text-xs text-charcoal/70">
          This is a simulated demo checkout. Select your preferred demo channel:
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { id: "upi", label: "UPI / QR", desc: "GPay, PhonePe, Paytm" },
            { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard" },
            { id: "cod", label: "Pay on Delivery", desc: "Cash or UPI on arrival" },
          ].map((pm) => (
            <button
              key={pm.id}
              type="button"
              onClick={() => setPaymentMethod(pm.id)}
              className={`rounded-2xl border p-4 text-left transition-all ${
                paymentMethod === pm.id
                  ? "border-terracotta bg-sand/30 ring-1 ring-terracotta shadow-sm"
                  : "border-ink/10 bg-white hover:border-ink/30"
              }`}
            >
              <p className="text-xs font-bold text-ink">{pm.label}</p>
              <p className="mt-1 text-[11px] text-charcoal/60">{pm.desc}</p>
            </button>
          ))}
        </div>

        {/* Security badge */}
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3.5 text-xs text-emerald-900">
          <svg className="h-5 w-5 shrink-0 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>
            100% Secure Demonstration: No real card details are ever requested or stored.
          </span>
        </div>
      </div>

      {err && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-700">
          {err}
        </div>
      )}

      <button
        type="submit"
        className="btn w-full !py-4 !text-base font-semibold shadow-lg"
        disabled={busy}
      >
        {busy ? "Confirming Order…" : "Place Demo Order →"}
      </button>
    </form>
  );
}

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { call } from "@/lib/client";

export default function AuthForm({
  mode,
  next,
}: {
  mode: "login" | "register";
  next: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const reg = mode === "register";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const payload = reg ? { name, email, password } : { email, password };
    const r = await call(`/api/auth/${mode}`, "POST", payload);
    setBusy(false);
    if (!r.ok) return setErr(r.error ?? "Authentication failed");
    router.push(next.startsWith("/") && !next.startsWith("//") ? next : "/");
    router.refresh();
  }

  function fillDemoUser() {
    setEmail("customer@veyra.test");
    setPassword("Customer123!");
    if (reg) setName("Demo Customer");
  }

  function fillDemoAdmin() {
    setEmail("admin@example.com");
    setPassword("ChangeMe123!");
    if (reg) setName("Store Admin");
  }

  return (
    <form onSubmit={submit} className="w-full space-y-6">
      <div className="space-y-2">
        <span className="badge badge-terracotta">
          {reg ? "New Membership" : "Secure Sign In"}
        </span>
        <h1 className="text-3xl sm:text-4xl font-display text-ink">
          {reg ? "Create your Veyra account" : "Welcome back to Veyra"}
        </h1>
        <p className="text-xs sm:text-sm text-charcoal/70">
          {reg
            ? "Join for private collection drops, saved wishlists, and seamless order tracking."
            : "Enter your credentials to access your saved wardrobe and orders."}
        </p>
      </div>

      <div className="space-y-4">
        {reg && (
          <div>
            <label className="label" htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Sharma"
              required
              className="input"
              autoComplete="name"
            />
          </div>
        )}

        <div>
          <label className="label" htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="input"
            autoComplete="email"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label !mb-0" htmlFor="password">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[11px] uppercase tracking-wider text-charcoal/60 hover:text-ink underline underline-offset-4"
            >
              {showPassword ? "Hide Password" : "Show Password"}
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={reg ? "Min 8 characters" : "Enter password"}
              required
              minLength={reg ? 8 : 1}
              className="input pr-10"
              autoComplete={reg ? "new-password" : "current-password"}
            />
          </div>
        </div>
      </div>

      {err && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700">
          {err}
        </div>
      )}

      <button
        type="submit"
        className="btn w-full !py-3.5 !text-sm font-semibold shadow-md"
        disabled={busy}
      >
        {busy ? "Authenticating…" : reg ? "Create Account →" : "Sign In →"}
      </button>

      {/* Demo helper buttons */}
      <div className="rounded-2xl border border-ink/10 bg-sand/30 p-4 text-xs space-y-2">
        <p className="font-semibold text-ink">Demo Quick Access</p>
        <p className="text-[11px] text-charcoal/60">
          Click below to fill test credentials for rapid evaluation:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={fillDemoUser}
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-[11px] font-medium text-ink hover:border-ink"
          >
            Fill Demo Customer
          </button>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-[11px] font-medium text-ink hover:border-ink"
          >
            Fill Demo Admin
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-charcoal/70 border-t border-ink/10 pt-4">
        {reg ? "Already have a Veyra account? " : "New to Veyra? "}
        <Link
          className="font-bold text-ink underline underline-offset-4 hover:text-terracotta"
          href={`${reg ? "/login" : "/register"}?next=${encodeURIComponent(next)}`}
        >
          {reg ? "Sign in instead" : "Create an account"}
        </Link>
      </div>
    </form>
  );
}

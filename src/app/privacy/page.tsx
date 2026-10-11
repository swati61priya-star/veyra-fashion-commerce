export default function PrivacyPage() {
  return (
    <div className="container-v py-12 lg:py-20 max-w-3xl space-y-6">
      <span className="badge badge-terracotta">Data Privacy</span>
      <h1 className="text-4xl font-display text-ink">Privacy Policy</h1>
      <div className="space-y-4 text-sm leading-relaxed text-charcoal/80 pt-4">
        <p>
          At VEYRA, we hold our customers&apos; privacy to the highest standard. This policy outlines how information is handled within this web application.
        </p>
        <h2 className="text-xl font-display text-ink pt-2">1. Data Storage & Security</h2>
        <p>
          All passwords are encrypted using industry-standard bcrypt hashing with 12 rounds. Authentication sessions are managed using signed, HttpOnly, SameSite cookies.
        </p>
        <h2 className="text-xl font-display text-ink pt-2">2. Payment Security</h2>
        <p>
          We never collect, process, or store credit or debit card details. All checkout workflows are simulated for portfolio and demonstration integrity.
        </p>
        <h2 className="text-xl font-display text-ink pt-2">3. Cookies</h2>
        <p>
          We only use strictly necessary cookies required for user authentication and cart session persistence.
        </p>
      </div>
    </div>
  );
}

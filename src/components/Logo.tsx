import Link from "next/link";

export default function Logo({
  size = "md",
  light = false,
  href = "/",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  light?: boolean;
  href?: string;
  className?: string;
}) {
  const sizeClasses = {
    sm: "text-lg tracking-[0.3em]",
    md: "text-2xl tracking-[0.35em]",
    lg: "text-3xl tracking-[0.4em]",
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 font-display font-semibold transition-opacity duration-200 hover:opacity-85 ${light ? "text-white" : "text-ink"} ${className}`}>
      {/* Veyra Crest Mark */}
      <svg
        className={size === "sm" ? "h-5 w-5" : size === "lg" ? "h-7 w-7" : "h-6 w-6"}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M8 8 L18 28 L28 8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="18" cy="12" r="2.2" fill="currentColor" />
      </svg>
      <span className={`${sizeClasses} uppercase`}>VEYRA</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="VEYRA Home" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
}

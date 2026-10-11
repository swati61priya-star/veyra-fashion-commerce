"use client";
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-v py-32 text-center">
      <h1 className="text-4xl">Something went wrong</h1>
      <p className="mt-3 text-charcoal/70">Please try again. If it keeps happening, check the terminal for details.</p>
      <button onClick={reset} className="btn mt-8">Try again</button>
    </div>
  );
}

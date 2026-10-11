export default function Loading() {
  return (
    <div className="container-v grid grid-cols-2 gap-4 py-10 md:grid-cols-3" role="status" aria-label="Loading products">
      {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse bg-beige" />)}
    </div>
  );
}

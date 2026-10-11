// Rule-based recommendations (NOT generative AI): scores products by overlap
// with "seed" products (viewed / carted / ordered / wishlisted).
import { split } from "./format";

export type Rec = {
  id: string; category: string; gender: string; tags: string; sizes: string; stock: number;
};

export function recommend<T extends Rec>(
  pool: T[], seeds: Rec[], opts: { exclude?: string[]; limit?: number } = {}
): T[] {
  const { exclude = [], limit = 4 } = opts;
  if (seeds.length === 0) return [];
  const cats = new Set(seeds.map((s) => s.category));
  const genders = new Set(seeds.map((s) => s.gender));
  const tags = new Set(seeds.flatMap((s) => split(s.tags)));
  const sizes = new Set(seeds.flatMap((s) => split(s.sizes)));
  const skip = new Set([...exclude, ...seeds.map((s) => s.id)]);

  return pool
    .filter((p) => !skip.has(p.id) && p.stock > 0)
    .map((p) => ({
      p,
      score:
        (cats.has(p.category) ? 3 : 0) +
        (genders.has(p.gender) || p.gender === "Unisex" ? 1 : 0) +
        split(p.tags).filter((t) => tags.has(t)).length * 2 +
        (split(p.sizes).some((s) => sizes.has(s)) ? 1 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
    .slice(0, limit);
}

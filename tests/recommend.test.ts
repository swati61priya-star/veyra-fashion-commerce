import { describe, it, expect } from "vitest";
import { recommend, type Rec } from "@/lib/recommend";

const p = (id: string, category: string, gender: string, tags: string, stock = 5): Rec =>
  ({ id, category, gender, tags, sizes: "S,M", stock });

describe("recommend", () => {
  const pool = [p("a", "Tops", "Men", "linen,summer"), p("b", "Tops", "Men", "wool"), p("c", "Bottoms", "Women", "silk"), p("d", "Tops", "Men", "linen", 0)];
  it("returns nothing without seeds", () => expect(recommend(pool, [])).toEqual([]));
  it("excludes seeds and out-of-stock items", () => {
    const ids = recommend(pool, [pool[0]]).map((x) => x.id);
    expect(ids).not.toContain("a");
    expect(ids).not.toContain("d");
  });
  it("ranks same category and shared tags first", () => {
    const seed = p("s", "Tops", "Men", "linen");
    expect(recommend(pool, [seed])[0].id).toBe("a");
  });
  it("respects the limit", () => expect(recommend(pool, [pool[0]], { limit: 1 })).toHaveLength(1));
});

import { describe, it, expect } from "vitest";
import { registerInput, checkoutInput, productInput, cartAdd } from "@/lib/validate";

describe("validation", () => {
  it("normalizes email and rejects short passwords", () => {
    expect(registerInput.parse({ name: "Ada Lovelace", email: " ADA@Example.com ", password: "longenough" }).email).toBe("ada@example.com");
    expect(registerInput.safeParse({ name: "Ada", email: "a@b.co", password: "short" }).success).toBe(false);
  });
  it("requires complete shipping details", () =>
    expect(checkoutInput.safeParse({ name: "A", address: "", city: "", postal: "", idempotencyKey: "x" }).success).toBe(false));
  it("rejects invalid products", () => {
    expect(productInput.safeParse({ name: "T", description: "Nice", priceCents: -5, category: "Hats", gender: "Men", sizes: "S", colors: "Red", stock: 1 }).success).toBe(false);
  });
  it("defaults cart quantity to 1 and caps it", () => {
    expect(cartAdd.parse({ productId: "p", size: "M", color: "Red" }).quantity).toBe(1);
    expect(cartAdd.safeParse({ productId: "p", size: "M", color: "Red", quantity: 99 }).success).toBe(false);
  });
});

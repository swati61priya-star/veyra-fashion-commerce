import { describe, it, expect } from "vitest";
import { computeSubtotal, shippingFor } from "@/lib/orders";

describe("pricing", () => {
  it("sums price x quantity in cents", () =>
    expect(computeSubtotal([{ priceCents: 4800, quantity: 2 }, { priceCents: 9800, quantity: 1 }])).toBe(19400));
  it("charges shipping under the free threshold", () => expect(shippingFor(100000)).toBe(14900));
  it("is free at or above Rs 3,999 and for empty carts", () => {
    expect(shippingFor(399900)).toBe(0);
    expect(shippingFor(0)).toBe(0);
  });
});

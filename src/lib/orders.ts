// Pure pricing helpers (server-side source of truth, easy to unit test).
export const FREE_SHIPPING_OVER_CENTS = 399900 // Rs 3,999;
export const SHIPPING_CENTS = 14900 // Rs 149;

export function computeSubtotal(items: { priceCents: number; quantity: number }[]) {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}

export function shippingFor(subtotalCents: number) {
  return subtotalCents === 0 || subtotalCents >= FREE_SHIPPING_OVER_CENTS ? 0 : SHIPPING_CENTS;
}

// Amounts are stored in paise (1/100 rupee) and shown in Indian Rupees.
export const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", minimumFractionDigits: paise % 100 === 0 ? 0 : 2, maximumFractionDigits: 2,
  }).format(paise / 100);

export const split = (s: string) => s.split(",").map((x) => x.trim()).filter(Boolean);

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

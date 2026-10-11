import { z } from "zod";

export const CATEGORIES = ["Tops", "Bottoms", "Outerwear", "Dresses", "Sets", "Kurtas", "Sarees", "Ethnic Wear", "Accessories", "Shoes", "Bags"] as const;
export const GENDERS = ["Men", "Women", "Kids", "Unisex"] as const;
export const ORDER_STATUSES = ["PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export const registerInput = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});
export const loginInput = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password").max(100),
});
export const cartAdd = z.object({
  productId: z.string().min(1), size: z.string().min(1, "Select a size"),
  color: z.string().min(1), quantity: z.number().int().min(1).max(10).default(1),
});
export const cartUpdate = z.object({ itemId: z.string().min(1), quantity: z.number().int().min(1).max(10) });
export const cartRemove = z.object({ itemId: z.string().min(1) });
export const wishlistInput = z.object({ productId: z.string().min(1) });
export const checkoutInput = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  address: z.string().trim().min(5, "Enter your street address").max(200),
  city: z.string().trim().min(2, "Enter your city").max(100),
  postal: z.string().trim().min(3, "Enter your postal code").max(20),
  idempotencyKey: z.string().min(8).max(100),
});
export const productInput = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(5).max(2000),
  priceCents: z.number().int().min(1).max(1_000_000),
  category: z.enum(CATEGORIES),
  gender: z.enum(GENDERS),
  tags: z.string().max(200).default(""),
  sizes: z.string().min(1).max(100),
  colors: z.string().min(1).max(100),
  image: z.string().max(500).nullable().optional(),
  stock: z.number().int().min(0).max(100000),
});
export const statusInput = z.object({ status: z.enum(ORDER_STATUSES) });

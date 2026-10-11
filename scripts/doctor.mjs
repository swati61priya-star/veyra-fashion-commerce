// Quick health check: npm run doctor
import fs from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const env = fs.existsSync(".env")
  ? Object.fromEntries(fs.readFileSync(".env", "utf8").split(/\r?\n/).filter((l) => l.includes("=") && !l.startsWith("#"))
      .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]; }))
  : null;
console.log(".env found:", !!env);
if (env) {
  console.log("DATABASE_URL set:", !!env.DATABASE_URL);
  console.log("AUTH_SECRET length:", (env.AUTH_SECRET || "").length, "(32+ is good)");
}
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();
try {
  console.log("products:", await db.product.count(), "| users:", await db.user.count());
  const h = await require("bcryptjs").hash("test", 4);
  console.log("bcrypt works:", h.length === 60);
  console.log("ALL GOOD");
} catch (e) {
  console.log("PROBLEM:", e.message);
} finally {
  await db.$disconnect();
}

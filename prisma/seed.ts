import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { slugify } from "../src/lib/format";

const db = new PrismaClient();
const CL = "XS,S,M,L,XL";
const NUM = "28,30,32,34,36";

type ProductSeed = {
  name: string;
  description: string;
  price: number;
  category: string;
  gender: string;
  tags: string;
  sizes: string;
  colors: string;
  stock: number;
  image?: string;
};

const products: ProductSeed[] = [
  // User Uploaded Flagship Products
  {
    name: "Tiered Floral Sundress",
    description: "Breezy tiered midi sundress crafted in breathable floral cotton with delicate spaghetti straps and a graceful flowing A-line silhouette. Perfect for warm sunshine and summer garden parties.",
    price: 3299,
    category: "Dresses",
    gender: "Women",
    tags: "floral,dress,summer,cotton,midi,bestseller,featured",
    sizes: "XS,S,M,L,XL",
    colors: "Floral White,Pastel Bloom",
    stock: 24,
    image: "/products/floral-tiered-sundress-1.jpg,/products/floral-tiered-sundress-2.jpg,/products/floral-tiered-sundress-3.jpg",
  },
  {
    name: "Pastel Polka Dot Two-Piece Set",
    description: "Playful two-piece coordinate set featuring a soft breathable polka dot crewneck tee paired with a coordinating pleated swing skirt. Made with ultra-gentle combed cotton for effortless all-day comfort.",
    price: 1499,
    category: "Sets",
    gender: "Kids",
    tags: "kids,polka,cotton,sets,summer,playwear,featured",
    sizes: "2-3Y,3-4Y,5-6Y,7-8Y",
    colors: "Pastel Pink,Mint Confetti",
    stock: 32,
    image: "/products/kids-polka-set-1.jpg,/products/kids-polka-set-2.jpg,/products/kids-polka-set-3.jpg",
  },
  {
    name: "Espresso Canvas Chore Jacket",
    description: "Tailored heavy cotton canvas workwear chore jacket with clean point collar, deep front patch pockets, and relaxed streetwear drape. Built to layer effortlessly over tees and knits.",
    price: 4499,
    category: "Outerwear",
    gender: "Men",
    tags: "jacket,outerwear,streetwear,canvas,autumn,bestseller,featured",
    sizes: "S,M,L,XL",
    colors: "Espresso,Dark Olive,Mocha",
    stock: 18,
    image: "/products/men-chore-jacket-1.png,/products/men-chore-jacket-2.png,/products/men-chore-jacket-3.png",
  },

  // Core Veyra Studio Garments
  {
    name: "Linen Camp Shirt",
    description: "Breathable European linen with a relaxed camp collar. Made for warm days and effortless sophistication.",
    price: 2499,
    category: "Tops",
    gender: "Men",
    tags: "linen,summer,casual,bestseller",
    sizes: CL,
    colors: "Sand,White,Olive",
    stock: 24,
    image: "/products/linen-camp-shirt.jpg",
  },
  {
    name: "Wide-Leg Trousers",
    description: "High-rise wide-leg tailored trousers in a crisp, drapey twill with sharp front pleats and fluid movement.",
    price: 2799,
    category: "Bottoms",
    gender: "Women",
    tags: "smart,twill,essentials,bestseller",
    sizes: "XS,S,M,L,XL",
    colors: "Beige,Black",
    stock: 22,
    image: "/products/wide-leg-trousers.jpg",
  },
  {
    name: "Silk Blend Blouse",
    description: "Fluid silk-blend blouse with concealed placket, refined spread collar and relaxed drape sleeve.",
    price: 3999,
    category: "Tops",
    gender: "Women",
    tags: "silk,smart,evening",
    sizes: "XS,S,M,L",
    colors: "Ivory,Black",
    stock: 12,
    image: "/products/silk-blend-blouse.jpg",
  },
  {
    name: "Straight Selvedge Jeans",
    description: "Mid-weight selvedge denim with a classic straight leg, copper rivets, and a timeless heritage wash.",
    price: 3499,
    category: "Bottoms",
    gender: "Men",
    tags: "denim,casual,essentials",
    sizes: NUM,
    colors: "Indigo,Black",
    stock: 26,
    image: "/products/selvedge-jeans.jpg",
  },
  {
    name: "Canvas Tote",
    description: "Heavy organic canvas tote with an inner phone pocket, vegetable-tanned leather handles, and reinforced seams.",
    price: 899,
    category: "Accessories",
    gender: "Unisex",
    tags: "cotton,casual,summer,accessories",
    sizes: "One Size",
    colors: "Natural,Black",
    stock: 45,
    image: "/products/canvas-tote.jpg",
  },
  {
    name: "Merino Crewneck",
    description: "Fine-gauge merino wool sweater, buttery soft against skin and naturally temperature regulating throughout every season.",
    price: 3499,
    category: "Tops",
    gender: "Unisex",
    tags: "wool,knit,winter,essentials",
    sizes: CL,
    colors: "Oatmeal,Charcoal,Black",
    stock: 30,
    image: "/products/merino-crewneck.jpg",
  },

  // Uploaded product photographs
  {
    name: "Oversized Black Graphic Tee",
    description: "Drop-shoulder oversized tee in heavyweight black cotton with a minimal chest logo and a relaxed streetwear fit.",
    price: 1799, category: "Tops", gender: "Men",
    tags: "tee,cotton,streetwear,oversized,casual,featured",
    sizes: CL, colors: "Black", stock: 40,
    image: "/products/men-oversized-black-tee.png,/products/men-oversized-black-tee-2.jpg,/products/men-oversized-black-tee-3.jpg",
  },
  {
    name: "Lotus Print Square-Neck Top",
    description: "Block-printed cotton top with a square neckline, flared sleeves and side slits, finished in a pink lotus print on an ivory base.",
    price: 2199, category: "Tops", gender: "Women",
    tags: "floral,cotton,block-print,casual,featured",
    sizes: "XS,S,M,L,XL", colors: "Ivory Pink", stock: 20,
    image: "/products/women-lotus-print-top.png,/products/women-lotus-print-top-2.jpg,/products/women-lotus-print-top-3.jpg",
  },
  {
    name: "Pink Embroidered Kurta Set",
    description: "Rani pink kurta with gold zari paisley embroidery at the yoke and cuffs, paired with matching salwar.",
    price: 5999, category: "Kurtas", gender: "Women",
    tags: "kurta,ethnic,festive,embroidered,featured",
    sizes: "XS,S,M,L,XL", colors: "Rani Pink", stock: 14,
    image: "/products/women-pink-embroidered-kurta-set.png,/products/women-pink-embroidered-kurta-set-2.jpg,/products/women-pink-embroidered-kurta-set-3.jpg",
  },
  {
    name: "Ivory Embroidered Sharara Set",
    description: "Sleeveless embroidered kurta with pearl and thread work, sequinned sharara pants and a sheer dupatta in a soft blush-ivory.",
    price: 8999, category: "Ethnic Wear", gender: "Women",
    tags: "sharara,ethnic,festive,embroidered,evening,featured",
    sizes: "XS,S,M,L,XL", colors: "Blush Ivory", stock: 10,
    image: "/products/women-ivory-embroidered-sharara-set.png,/products/women-ivory-embroidered-sharara-set-2.jpg,/products/women-ivory-embroidered-sharara-set-3.jpg",
  },
  {
    name: "Gingham Fish Applique Set",
    description: "Kids' two-piece set in teal gingham seersucker with a fish applique and rickrack trim: sleeveless top and shorts.",
    price: 1299, category: "Sets", gender: "Kids",
    tags: "kids,gingham,cotton,sets,summer,playwear",
    sizes: "2-3Y,3-4Y,5-6Y,7-8Y", colors: "Teal Gingham", stock: 18,
    image: "/products/kids-gingham-fish-set.png,/products/kids-gingham-fish-set-2.jpg,/products/kids-gingham-fish-set-3.jpg",
  },
  {
    name: "Floral Jacquard Bandhgala Vest",
    description: "Mandarin-collar waistcoat in a rich floral jacquard, worn over a black kurta for festive and wedding dressing.",
    price: 6499, category: "Ethnic Wear", gender: "Men",
    tags: "waistcoat,ethnic,festive,jacquard,featured",
    sizes: "S,M,L,XL", colors: "Black Floral", stock: 12,
    image: "/products/men-floral-bandhgala-vest.png,/products/men-floral-bandhgala-vest-2.jpg,/products/men-floral-bandhgala-vest-3.jpg",
  },
  {
    name: "Blue Floral Block-Print Top",
    description: "Relaxed cotton top with a notched neckline and short sleeves, finished in an indigo floral block print with contrast border trims.",
    price: 1999, category: "Tops", gender: "Women",
    tags: "top,floral,cotton,block-print,casual,summer",
    sizes: "XS,S,M,L,XL", colors: "Ivory Blue", stock: 26,
    image: "/products/women-blue-floral-tunic.png,/products/women-blue-floral-tunic-2.jpg,/products/women-blue-floral-tunic-3.jpg",
  },
  {
    name: "Butter Yellow Wrap Top",
    description: "Cap-sleeve wrap top in textured soft yellow with a collared V-neck, gathered side and tie-and-bead closure.",
    price: 1699, category: "Tops", gender: "Women",
    tags: "top,wrap,summer,casual,blouse",
    sizes: "XS,S,M,L", colors: "Yellow", stock: 22,
    image: "/products/women-yellow-wrap-top.png,/products/women-yellow-wrap-top-2.jpg,/products/women-yellow-wrap-top-3.jpg",
  },
  {
    name: "Fuchsia Linen Shirt",
    description: "Breathable washed-linen shirt in vivid fuchsia with a relaxed fit and roll-up sleeves. Easy over trousers or as a layer.",
    price: 2299, category: "Tops", gender: "Women",
    tags: "shirt,linen,casual,summer,essentials",
    sizes: "XS,S,M,L,XL", colors: "Fuchsia", stock: 20,
    image: "/products/women-fuchsia-linen-shirt.png,/products/women-fuchsia-linen-shirt-2.jpg,/products/women-fuchsia-linen-shirt-3.jpg",
  },
  {
    name: "Floral Embroidered Saree with Puff-Sleeve Blouse",
    description: "Lightweight ivory saree with a powder-blue border and scattered blue floral motifs, styled with a puff-sleeve blue blouse.",
    price: 4999, category: "Sarees", gender: "Women",
    tags: "saree,ethnic,festive,embroidered",
    sizes: "Free Size", colors: "Ivory Blue", stock: 9,
    image: "/products/women-floral-saree.png,/products/women-floral-saree-2.jpg,/products/women-floral-saree-3.jpg",
  },
  {
    name: "Pink Gingham Peplum Set",
    description: "Kids' two-piece set with a ruffle-neck peplum top and wide-leg pants in a pink gingham seersucker.",
    price: 1399, category: "Sets", gender: "Kids",
    tags: "kids,gingham,cotton,sets,summer,playwear",
    sizes: "2-3Y,3-4Y,5-6Y,7-8Y", colors: "Pink Gingham", stock: 16,
    image: "/products/kids-pink-gingham-peplum-set.png,/products/kids-pink-gingham-peplum-set-2.jpg,/products/kids-pink-gingham-peplum-set-3.jpg",
  },
  {
    name: "Black Baguette Shoulder Bag",
    description: "Smooth black shoulder bag with a curved silhouette, zip closure and gold-tone hardware.",
    price: 2799, category: "Bags", gender: "Women",
    tags: "bag,shoulder,leather,evening,accessories",
    sizes: "One Size", colors: "Black", stock: 15,
    image: "/products/women-black-baguette-bag.png,/products/women-black-baguette-bag-2.jpg,/products/women-black-baguette-bag-3.jpg",
  },
  {
    name: "Tan Leather Bifold Wallet",
    description: "Full-grain tan leather bifold with contrast stitching and a slim profile for everyday carry.",
    price: 1499, category: "Accessories", gender: "Men",
    tags: "wallet,leather,accessories,essentials",
    sizes: "One Size", colors: "Tan", stock: 30,
    image: "/products/men-tan-leather-wallet.png,/products/men-tan-leather-wallet-2.jpg,/products/men-tan-leather-wallet-3.jpg",
  },
];

async function main() {
  for (const item of products) {
    const slug = slugify(item.name);
    const data = {
      name: item.name,
      description: item.description,
      priceCents: item.price * 100,
      category: item.category,
      gender: item.gender,
      tags: item.tags,
      sizes: item.sizes,
      colors: item.colors,
      stock: item.stock,
      image: item.image ?? null,
    };
    await db.product.upsert({ where: { slug }, update: data, create: { slug, ...data } });
  }
  console.log(`Seeded ${products.length} products.`);

  // Remove old catalogue entries that have no photograph (never shown as blank/illustrated cards).
  // Products that already appear in orders are kept to preserve order history.
  const stale = await db.product.findMany({ where: { OR: [{ image: null }, { image: "" }] }, select: { id: true, name: true, _count: { select: { orderItems: true } } } });
  for (const st of stale) {
    if (st._count.orderItems === 0) { await db.product.delete({ where: { id: st.id } }); console.log(`Removed (no photo): ${st.name}`); }
    else console.log(`Kept (has orders, no photo): ${st.name}`);
  }

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production") {
    console.log("Production mode: skipping admin creation.");
  } else if (email && password) {
    if (password.length < 8) throw new Error("ADMIN_PASSWORD must be at least 8 characters");
    const passwordHash = await bcrypt.hash(password, 12);
    await db.user.upsert({
      where: { email },
      update: { role: "ADMIN", passwordHash },
      create: { email, name: "Admin", role: "ADMIN", passwordHash },
    });
    console.log(`Admin account ready: ${email}`);
  } else {
    console.log("ADMIN_EMAIL / ADMIN_PASSWORD not set: no admin created (see README).");
  }
}

main().finally(() => db.$disconnect());

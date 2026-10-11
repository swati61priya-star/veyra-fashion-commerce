import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import AuthForm from "@/components/AuthForm";
import ProductImage from "@/components/ProductImage";

export const dynamic = "force-dynamic";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next = searchParams.next ?? "/account";
  if (await getUser()) {
    redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/account");
  }

  return (
    <div className="container-v py-12 lg:py-16">
      <div className="grid gap-10 overflow-hidden rounded-[2.5rem] border border-ink/10 bg-white shadow-sm lg:grid-cols-12">
        {/* Left Editorial Visual */}
        <div className="relative hidden aspect-[4/5] overflow-hidden bg-sand lg:col-span-6 lg:block lg:h-full">
          <ProductImage
            src="/products/floral-tiered-sundress-1.jpg"
            name="Veyra Women's Collection"
            category="Dresses"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-10 text-white">
            <span className="badge badge-terracotta mb-2 w-max">Exclusive Access</span>
            <p className="font-display text-3xl">Become a Veyra Insider.</p>
            <p className="text-xs text-white/70 mt-1">Enjoy complimentary express shipping and seasonal early drops.</p>
          </div>
        </div>

        {/* Right Auth Form */}
        <div className="flex items-center justify-center p-6 sm:p-12 lg:col-span-6 lg:p-16">
          <div className="w-full max-w-md">
            <AuthForm mode="register" next={next} />
          </div>
        </div>
      </div>
    </div>
  );
}

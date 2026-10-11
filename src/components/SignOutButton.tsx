"use client";
import { useRouter } from "next/navigation";
import { call } from "@/lib/client";

export default function SignOutButton() {
  const router = useRouter();
  return (
    <button className="hover:underline underline-offset-4" onClick={async () => {
      await call("/api/auth/logout", "POST");
      router.push("/"); router.refresh();
    }}>Sign out</button>
  );
}

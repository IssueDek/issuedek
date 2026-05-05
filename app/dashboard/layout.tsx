"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthCompany } from "@/lib/useAuthCompany";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, company, loading } = useAuthCompany();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/signup");
      return;
    }

    if (company && !company.verified) {
      router.push("/verify-domain");
    }
  }, [user, company, loading, router]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user || !company || !company.verified) return null;

  return <>{children}</>;
}

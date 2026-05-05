"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthCompany } from "@/lib/useAuthCompany";

export default function DashboardPage() {
  const { user, company, loading } = useAuthCompany();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // ❌ Not logged in
    if (!user) {
      router.push("/signup");
      return;
    }

    // ❌ Company not loaded
    if (!company) return;

    // ❌ Not verified
    if (!company.verified) {
      router.push("/verify-domain");
    }
  }, [user, company, loading, router]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!user) return null;
  if (!company) return null;

  // Block UI until verified
  if (!company.verified) return null;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p className="mt-2 text-gray-500">
        Welcome, your company is verified 🎉
      </p>
    </div>
  );
}

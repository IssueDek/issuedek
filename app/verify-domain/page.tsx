"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function VerifyDomainPage() {
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCompany = async () => {
      const user = auth.currentUser;

      if (!user) {
        router.push("/signup");
        return;
      }

      // Get user document
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) return;

      const { companyId } = userDoc.data();

      // Get company
      const companyDoc = await getDoc(doc(db, "companies", companyId));

      if (companyDoc.exists()) {
        setCompany({ id: companyId, ...companyDoc.data() });
      }

      setLoading(false);
    };

    fetchCompany();
  }, [router]);

  if (loading) return <p className="p-6">Loading...</p>;

  if (!company) return <p className="p-6">No company found</p>;

  const txtValue = `issuedek-verification=${company.verificationToken}`;

  // Copy TXT
  const copyTxt = () => {
    navigator.clipboard.writeText(txtValue);
    alert("Copied!");
  };

  // DEV VERIFY (temporary)
  const handleVerify = async () => {
    await updateDoc(doc(db, "companies", company.id), {
      verified: true,
    });

    alert("Domain verified (dev mode)");
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-lg bg-base-100 shadow">
        <div className="card-body space-y-4">
          <h2 className="text-xl font-bold text-center">
            Verify Your Domain
          </h2>

          <p className="text-sm text-gray-500 text-center">
            To verify ownership of <b>{company.domain}</b>, add the following TXT
            record to your domain provider.
          </p>

          {/* TXT RECORD BOX */}
          <div className="bg-base-200 p-4 rounded">
            <p className="text-sm">Type: TXT</p>
            <p className="text-sm">Name: @</p>

            <div className="flex items-center justify-between mt-2">
              <code className="text-xs break-all">{txtValue}</code>
              <button className="btn btn-sm btn-outline" onClick={copyTxt}>
                Copy
              </button>
            </div>
          </div>

          {/* BUTTONS */}
          <button className="btn btn-primary" onClick={handleVerify}>
            Verify Domain
          </button>

          <p className="text-xs text-center text-gray-400">
            DNS changes may take a few minutes.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Clean domain
function cleanDomain(domain: string) {
  return domain
    .replace("https://", "")
    .replace("http://", "")
    .replace("www.", "")
    .trim();
}

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    domain: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    // Basic validation
    if (!form.name || !form.email || !form.company || !form.domain) {
      alert("Please fill all fields");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // 🔐 1. Create user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      const uid = userCred.user.uid;

      // 🧠 2. Prepare company data
      const companyId = crypto.randomUUID();
      const token = Math.random().toString(36).substring(2);
      const domain = cleanDomain(form.domain);

      // 🏢 3. Create company
      await setDoc(doc(db, "companies", companyId), {
        name: form.company,
        domain: domain,
        verificationToken: token,
        verified: false,
        createdAt: serverTimestamp(),
      });

      // 👤 4. Create user doc
      await setDoc(doc(db, "users", uid), {
        name: form.name,
        email: form.email,
        companyId: companyId,
        role: "admin",
        createdAt: serverTimestamp(),
      });

      // 🚀 5. Redirect
      router.push("/verify-domain");

    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow">
        <div className="card-body space-y-3">
          <h2 className="text-xl font-bold text-center">Create Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            className="input input-bordered w-full"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Company Name"
            className="input input-bordered w-full"
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />

          <input
            type="text"
            placeholder="Domain (example.com)"
            className="input input-bordered w-full"
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="input input-bordered w-full"
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />

          <button
            onClick={handleSignup}
            className="btn btn-primary mt-3"
            disabled={loading}
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

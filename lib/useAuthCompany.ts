"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export function useAuthCompany() {
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setCompany(null);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      // Get user document
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

      if (!userDoc.exists()) {
        setLoading(false);
        return;
      }

      const { companyId } = userDoc.data();

      // Get company document
      const companyDoc = await getDoc(doc(db, "companies", companyId));

      if (companyDoc.exists()) {
        setCompany({ id: companyId, ...companyDoc.data() });
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, company, loading };
}

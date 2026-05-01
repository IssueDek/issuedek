"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [company, setCompany] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();
      if (!userData) return;

      const userCompany = userData.company;
      setCompany(userCompany);

      const querySnapshot = await getDocs(collection(db, "complaints"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = data.filter((item: any) =>
        item.company?.toLowerCase().includes(userCompany.toLowerCase())
      );

      setComplaints(filtered);
    };

    fetchData();
  }, []);

  const total = complaints.length;

  const categoryCount: Record<string, number> = {};
  complaints.forEach((c: any) => {
    const cat = c.category || "other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  return (
    <div className="p-6 bg-base-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">
        {company} Dashboard
      </h2>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card bg-base-200 shadow p-4">
          <h3 className="text-sm text-gray-500">Total Complaints</h3>
          <p className="text-2xl font-bold">{total}</p>
        </div>
      </div>

      {/* CATEGORY */}
      <div className="card bg-base-200 shadow p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">
          Category Breakdown
        </h3>

        <ul className="space-y-2">
          {Object.entries(categoryCount).map(([key, val]) => (
            <li key={key} className="flex justify-between">
              <span className="capitalize">{key}</span>
              <span className="font-bold">{val}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* LIST */}
      <div className="card bg-base-200 shadow p-4">
        <h3 className="text-lg font-semibold mb-4">
          Recent Complaints
        </h3>

        {complaints.length === 0 && (
          <p>No complaints found</p>
        )}

        <div className="space-y-4">
          {complaints.map((item) => (
            <div
              key={item.id}
              className="p-4 border rounded-lg bg-base-100"
            >
              <h4 className="font-bold">{item.company}</h4>
              <p className="text-sm text-gray-600">{item.issue}</p>

              <span className="badge badge-outline mt-2">
                {item.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
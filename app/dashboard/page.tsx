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

      // Get user company
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.data();

      if (!userData) return;

      const userCompany = userData.company;
      setCompany(userCompany);

      // Get complaints
      const querySnapshot = await getDocs(collection(db, "complaints"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Filter automatically
      const filtered = data.filter((item: any) =>
        item.company?.toLowerCase().includes(userCompany.toLowerCase())
      );

      setComplaints(filtered);
    };

    fetchData();
  }, []);

  // Analytics
  const total = complaints.length;

  const categoryCount: Record<string, number> = {};
  complaints.forEach((c: any) => {
    const cat = c.category || "other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });

  return (
    <div style={{ padding: 30 }}>
      <h2>{company} Dashboard</h2>

      <h3>Total Complaints: {total}</h3>

      <h3>Category Breakdown:</h3>
      <ul>
        {Object.entries(categoryCount).map(([key, val]) => (
          <li key={key}>
            {key}: {val}
          </li>
        ))}
      </ul>

      <hr />

      {complaints.length === 0 && <p>No complaints found</p>}

      {complaints.map((item) => (
        <div key={item.id} style={{ marginBottom: 20 }}>
          <h4>{item.company}</h4>
          <p>{item.issue}</p>
          <small>{item.category}</small>
          <hr />
        </div>
      ))}
    </div>
  );
}

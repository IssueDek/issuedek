"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Submit() {
  const [company, setCompany] = useState("");
  const [issue, setIssue] = useState("");
  const [category, setCategory] = useState("");

  const submitComplaint = async () => {
    if (!company || !issue) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await addDoc(collection(db, "complaints"), {
        company,
        issue,
        category,
        createdAt: new Date(),
      });

      alert("Complaint submitted successfully");

      setCompany("");
      setIssue("");
      setCategory("");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Submit Complaint</h2>

      <input
        placeholder="Company name"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
      />
      <br /><br />

      <textarea
        placeholder="Describe your issue"
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
      />
      <br /><br />

      <input
        placeholder="Category (delay, damage, service)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <br /><br />

      <button onClick={submitComplaint}>Submit</button>
    </div>
  );
}
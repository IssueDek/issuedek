"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div style={{
      padding: 15,
      borderBottom: "1px solid #ccc",
      display: "flex",
      gap: 20
    }}>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/submit">Submit</Link>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
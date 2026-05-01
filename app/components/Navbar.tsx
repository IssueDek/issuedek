"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-md px-6">
      <div className="flex-1">
        <Link href="/" className="text-xl font-bold">
          IssueDek
        </Link>
      </div>

      <div className="flex gap-6">
        <Link href="/dashboard" className="hover:text-primary">
          Dashboard
        </Link>

        <Link href="/submit" className="hover:text-primary">
          Submit
        </Link>

        <Link href="/login" className="hover:text-primary">
          Login
        </Link>
      </div>
    </div>
  );
}
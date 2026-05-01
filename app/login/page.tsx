"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");

  const signup = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Save user company
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        company,
      });

      alert("User created");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Login / Signup</h2>

      <input
        placeholder="Company name"
        onChange={(e) => setCompany(e.target.value)}
      /><br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Login</button>
    </div>
  );
}
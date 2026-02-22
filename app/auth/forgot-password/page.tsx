"use client";

import { useState } from "react";
import axios from "axios";
import styles from "../styles/login.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePublicGuard } from "@/lib/usePublicGuard";

export default function ForgotPasswordPage() {
  usePublicGuard();

  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false); 
  const router = useRouter();

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      alert("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/forgot-password", {
        email: trimmedEmail,
      });

      if (res.data?.status === "OK") {
        alert("Password reset email sent");
        router.push("/auth/reset-password");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Forgot Password</h2>

        <input
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <button
          onClick={handleSubmit}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        <div className={styles.centerText}>
          <Link href="/auth/login">Back to Login</Link>
        </div>
      </div>
    </div>
  );
}
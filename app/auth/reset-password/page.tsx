"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css";
import { usePublicGuard } from "@/lib/usePublicGuard";

export default function ResetPasswordPage() {
  usePublicGuard();
  const router = useRouter();

  const [token, setToken] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const cleanToken = token.trim();

    if (!cleanToken || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/reset-password", {
        token: cleanToken,
        password,
      });

      if (res.data?.status === "OK") {
        alert("Password reset successful! Please login with your new password.");
        router.push("/auth/login");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Reset Password</h2>

        <p style={{ fontSize: "14px", marginBottom: "15px", color: "#555" }}>
          Enter the 6-digit code sent to your email.
        </p>

        <input
          placeholder="6-Digit Reset Code"
          onChange={(e) => setToken(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="New password"
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Confirm password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={styles.input}
        />

        <button
          onClick={handleReset}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}
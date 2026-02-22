"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "../styles/login.module.css";
import Link from "next/link";
import { usePublicGuard } from "@/lib/usePublicGuard";

export default function LoginPage() {
  usePublicGuard();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false); 

  const router = useRouter();

  const handleLogin = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/login", {
        email: trimmedEmail,
        password,
      });

      if (res.data?.status === "OK") {
        const { role, token } = res.data.result[0];

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        if (role === "organizer") {
          router.push("/organizer");
        } else {
          router.push("/attendee/home");
        }
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <div className={styles.forgotText}>
          <Link href="/auth/forgot-password">Forgot password?</Link>
        </div>

        <button
          onClick={handleLogin}
          className={styles.button}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className={styles.centerText}>
          Don’t have an account? <Link href="/auth/register">Register</Link>
        </div>
      </div>
    </div>
  );
}
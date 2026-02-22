"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../styles/register.module.css";
import { usePublicGuard } from "@/lib/usePublicGuard";
import { registerSchema } from "@/lib/validation/registerSchema";

export default function RegisterPage() {
  usePublicGuard();
  const router = useRouter();

  const [form, setForm] = useState<Record<string, string>>({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("register");
  const [loading, setLoading] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateField = (name: string, value: string) => {
    const fieldSchema =
      registerSchema.shape[name as keyof typeof registerSchema.shape];

    const result = fieldSchema.safeParse(value);

    if (!result.success) {
      const message = result.error.issues[0].message;

      if (name === "name") setNameError(message);
      if (name === "email") setEmailError(message);
      if (name === "password") setPasswordError(message);
    } else {
      if (name === "name") setNameError("");
      if (name === "email") setEmailError("");
      if (name === "password") setPasswordError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value })); 
    validateField(name, value);
  };

  const handleRegister = async () => {
    try {
      registerSchema.parse(form);

      setLoading(true);

      const res = await axios.post("/api/auth/register", {
        ...form,
        email: form.email.trim(),
      });

      if (res.data.status === "OK") {
        alert("OTP sent to your email");
        setStep("verify");
      }
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: any = {};
        err.errors.forEach((e: any) => {
          fieldErrors[e.path[0]] = e.message;
        });

        setNameError(fieldErrors.name || "");
        setEmailError(fieldErrors.email || "");
        setPasswordError(fieldErrors.password || "");
        return;
      }

      alert(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      alert("Please enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/auth/verify-otp", {
        email: form.email.trim(),
        otp: cleanOtp,
      });

      if (res.data?.status === "OK") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);

        router.push("/attendee/home");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>

        {step === "register" && (
          <>
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />
            {nameError && <p className={styles.errorText}>{nameError}</p>}

            <input
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
            />
            {emailError && <p className={styles.errorText}>{emailError}</p>}

            <input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
            />
            {passwordError && (
              <p className={styles.errorText}>{passwordError}</p>
            )}

            <button
              onClick={handleRegister}
              className={styles.button}
              disabled={
                loading ||
                !!nameError ||
                !!emailError ||
                !!passwordError
              }
            >
              {loading ? "Processing..." : "Register"}
            </button>

            <div className={styles.centerText}>
              Already have an account? <Link href="/auth/login">Login</Link>
            </div>
          </>
        )}

        {step === "verify" && (
          <>
            <h3 className={styles.centerText}>Enter OTP</h3>

            <input
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={styles.input}
            />

            <button
              onClick={handleVerify}
              className={styles.button}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
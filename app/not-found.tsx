"use client";

import { useRouter } from "next/navigation";
import styles from "./not-found.module.css";

export default function NotFound() {
  const router = useRouter();

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); 
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.text}>
          Oops! The page you are looking for doesn’t exist or was moved.
        </p>

        <button
          type="button"
          onClick={handleBack}
          className={styles.button}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const user = JSON.parse(token);
        setUserName(user.name);
      } catch {
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("token");
      router.push("/auth/login");
    }
  };

  return (
    <nav className={styles.navbar}>
      <h2>{userName ? `Welcome! ${userName}` : ""}</h2>

      <div className={styles.links}>
        {userName && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}


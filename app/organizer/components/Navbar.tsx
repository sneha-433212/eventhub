"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const token = localStorage.getItem("token");
    if (token && mounted) {
      try {
        setUser(JSON.parse(token));
      } catch (err) {
        console.error("Auth error", err);
        localStorage.removeItem("token"); 
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    localStorage.removeItem("token");

    router.replace("/auth/login"); 
    router.refresh(); 
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        Organizer Dashboard
      </div>

      <div className={styles.profileSection}>
        {user && (
          <>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.roleBadge}>ORGANIZER</span>
            </div>

            <button className={styles.logoutBtn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../styles/Sidebar.module.css";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path ? styles.active : "";

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>EventHub</h2>

      <nav className={styles.nav}>
        <Link
          href="/organizer"
          className={`${styles.link} ${isActive("/organizer")}`}
        >
          Dashboard
        </Link>

        <Link
          href="/organizer/dashboard"
          className={`${styles.link} ${isActive("/organizer/dashboard")}`}
        >
          My Events
        </Link>

        <Link
          href="/organizer/registrations"
          className={`${styles.link} ${isActive("/organizer/registrations")}`}
        >
          Registrations
        </Link>

        <Link
          href="/organizer/profile"
          className={`${styles.link} ${isActive("/organizer/profile")}`}
        >
          Profile
        </Link>
      </nav>
    </aside>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineEventRepeat } from "react-icons/md";
import { FaCalendarAlt, FaClipboardList } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import styles from "../styles/sidebar.module.css";

type User = {
  name?: string;
  email?: string;
};

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setUser(JSON.parse(token));
      } catch (err) {
        console.error("Invalid token format");
      }
    }
  }, []);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <MdOutlineEventRepeat className={styles.brandIcon} />
        EventHub
      </div>

      <div className={styles.profile}>
        {user ? (
          <>
            <div className={styles.avatar}>
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </>
        ) : (
          <>
            <Skeleton circle width={70} height={70} />
            <Skeleton width={120} height={15} style={{ marginTop: 10 }} />
            <Skeleton width={160} height={12} />
          </>
        )}
      </div>

      <nav className={styles.nav}>
        <Link
          href="/attendee/home"
          className={`${styles.link} ${
            pathname === "/attendee/home" ? styles.active : ""
          }`}
        >
          <FaCalendarAlt className={styles.icon} />
          Browse Events
        </Link>

        <Link
          href="/attendee/registrations"
          className={`${styles.link} ${
            pathname === "/attendee/registrations" ? styles.active : ""
          }`}
        >
          <FaClipboardList className={styles.icon} />
          My Registrations
        </Link>
      </nav>
    </aside>
  );
}

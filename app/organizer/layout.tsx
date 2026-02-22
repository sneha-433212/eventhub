"use client";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import styles from "./styles/organizerDashboard.module.css";

export default function OrganizerLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />
      <div className={styles.right}>
        <Navbar />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
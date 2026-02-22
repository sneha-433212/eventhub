"use client";

import Navbar from "./home/components/Navbar"; 
import Sidebar from "./components/Sidebar";    
import styles from "./styles/attendeeLayout.module.css";

export default function AttendeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <Sidebar />

      <div className={styles.rightSection}>
        <Navbar />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}

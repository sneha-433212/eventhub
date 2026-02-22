"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./styles/organizerDashboard.module.css";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function OrganizerDashboardPage() {
  useAuthGuard("organizer");

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        let user;
        try {
          user = JSON.parse(token);
        } catch {
          setLoading(false);
          return;
        }

        const res = await axios.get("/api/events");

        if (res.data?.status === "OK") {
          const myEvents = (res.data.result || []).filter(
            (e: any) => Number(e.organizerId) === Number(user.id)
          );

          const now = new Date();

          setStats({
            totalEvents: myEvents.length,
            totalRegistrations: myEvents.reduce(
              (sum: number, e: any) =>
                sum + (Number(e.registeredCount) || 0),
              0
            ),
            upcomingEvents: myEvents.filter(
              (e: any) =>
                e.eventDate &&
                new Date(e.eventDate) > now
            ).length,
          });
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.stats}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={styles.card}
              style={{ background: "#e5e7eb" }}
            >
              <div
                style={{
                  height: "16px",
                  width: "60%",
                  background: "#d1d5db",
                  borderRadius: "6px",
                  margin: "0 auto 12px",
                }}
              />
              <div
                style={{
                  height: "28px",
                  width: "40%",
                  background: "#d1d5db",
                  borderRadius: "6px",
                  margin: "0 auto",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.stats}>
        <div className={styles.card}>
          <span className={styles.label}>Total Events</span>
          <span className={styles.value}>{stats.totalEvents}</span>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Total Registrations</span>
          <span className={styles.value}>{stats.totalRegistrations}</span>
        </div>

        <div className={styles.card}>
          <span className={styles.label}>Upcoming Events</span>
          <span className={styles.value}>{stats.upcomingEvents}</span>
        </div>
      </div>
    </div>
  );
}
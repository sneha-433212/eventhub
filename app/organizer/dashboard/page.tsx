"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "../styles/dashboard.module.css";
import type { Event } from "@/types";
import { FaEye, FaEdit, FaTrash, FaCalendarAlt } from "react-icons/fa";
import { useAuthGuard } from "@/lib/useAuthGuard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OrganizerDashboardPage() {
  useAuthGuard("organizer");

  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      let user;
      try {
        user = JSON.parse(token);
      } catch {
        router.push("/auth/login");
        return;
      }

      const res = await axios.get("/api/events");

      if (res.data.status === "OK") {
        const myEvents = res.data.result
          .filter((e: any) => Number(e.organizerId) === Number(user.id))
          .reverse();

        setEvents(myEvents);
      }
    } catch (error) {
      console.error("Failed to load events", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      let user;
      try {
        user = JSON.parse(token);
      } catch {
        return;
      }

      await axios.delete(`/api/events/${id}?organizerId=${user.id}`);

      setEvents((prev) => prev.filter((e) => e.id !== id));

      alert("Event deleted successfully");
    } catch (error) {
      alert("Could not delete this event. You may not be the owner.");
    }
  }

  const EventSkeleton = () => (
    <div className={styles.eventsWrapper}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className={styles.eventCard}>
          <Skeleton height={160} borderRadius={8} />

          <div className={styles.eventInfo}>
            <Skeleton height={20} width="70%" />
            <Skeleton height={14} width="50%" />
            <Skeleton height={14} width="40%" />
          </div>

          <div className={styles.actions}>
            <Skeleton circle height={32} width={32} />
            <Skeleton circle height={32} width={32} />
            <Skeleton circle height={32} width={32} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>My Events</h1>
        <button
          onClick={() => router.push("/organizer/create")}
          className={styles.createButton}
        >
          + Create New Event
        </button>
      </div>

      {loading ? (
        <EventSkeleton />
      ) : events.length === 0 ? (
        <p className={styles.centerText}>No events created yet.</p>
      ) : (
        <div className={styles.eventsWrapper}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className={styles.eventImage}
                />
              )}

              <div className={styles.eventInfo}>
                <h3>{event.title}</h3>

                <p className={styles.eventDate}>
                  <FaCalendarAlt
                    style={{ marginRight: 6, verticalAlign: "middle" }}
                  />
                  {event.eventDate
                    ? new Date(event.eventDate)
                        .toLocaleString("sv-SE", { hour12: false })
                        .slice(0, 16)
                    : ""}
                </p>

                <p className={styles.eventLocation}>📍 {event.location}</p>
              </div>

              <div className={styles.actions}>
                <button
                  title="View Event"
                  className={styles.iconButton}
                  onClick={() => router.push(`/organizer/create/${event.id}`)}
                >
                  <FaEye />
                </button>

                <button
                  title="Edit Event"
                  onClick={() =>
                    router.push(`/organizer/create?id=${event.id}`)
                  }
                  className={styles.iconButton}
                >
                  <FaEdit />
                </button>

                <button
                  title="Delete Event"
                  onClick={() => handleDelete(Number(event.id))}
                  className={`${styles.iconButton} ${styles.deleteButton}`}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
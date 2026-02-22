"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/useAuthGuard";
import styles from "./styles/OrganizerEventDetails.module.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OrganizerViewEventPage() {
  useAuthGuard("organizer");

  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchEvent() {
      try {
        const res = await axios.get(`/api/events/${id}`);
        setEvent(res.data?.result || null);
      } catch (error) {
        console.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.topSection}>
          <Skeleton height={240} width={380} borderRadius={10} />

          <div style={{ flex: 1 }}>
            <Skeleton height={28} width="60%" style={{ marginBottom: 15 }} />
            <Skeleton height={18} width="40%" style={{ marginBottom: 12 }} />
            <Skeleton height={18} width="50%" style={{ marginBottom: 12 }} />
            <Skeleton height={18} width="45%" style={{ marginBottom: 12 }} />
            <Skeleton height={18} width="35%" style={{ marginBottom: 12 }} />
            <Skeleton height={18} width="80%" style={{ marginTop: 20 }} />
            <Skeleton height={18} width="90%" />
          </div>
        </div>
      </main>
    );
  }

  if (!loading && !event) {
    router.replace("/not-found");
    return null;
  }

  const registered = event.registeredCount ?? 0;
  const remaining = Math.max(0, event.capacity - registered);

  return (
    <main className={styles.container}>
      <div className={styles.topSection}>
        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className={styles.image}
          />
        )}

        <div className={styles.details}>
          <h2 className={styles.eventTitle}>
            {event.title || "Untitled Event"}
          </h2>

          <p className={styles.meta}>
            <strong>Date:</strong>{" "}
            {event.eventDate
              ? new Date(event.eventDate).toLocaleDateString()
              : "N/A"}
          </p>

          <p className={styles.meta}>
            <strong>Time:</strong>{" "}
            {event.eventDate
              ? new Date(event.eventDate).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A"}
          </p>

          <p className={styles.meta}>
            <strong>Location:</strong>{" "}
            {event.location || "N/A"}
          </p>

          <p className={styles.meta}>
            <strong>Capacity:</strong> {event.capacity}
          </p>

          <p className={styles.meta}>
            <strong>Registrations:</strong>{" "}
            {registered} / {event.capacity}
          </p>

          <p className={styles.meta}>
            <strong>Spots Remaining:</strong> {remaining}
          </p>

          <p className={styles.meta}>
            <strong>Category:</strong>{" "}
            {event.category?.name || "N/A"}
          </p>

          <p className={styles.meta}>
            <strong>Status:</strong>{" "}
            {event.status || "N/A"}
          </p>

          <p className={styles.sectionTitle}>
            <strong>Description:</strong>
          </p>

          <p className={styles.description}>
            {event.description || "No description provided"}
          </p>
        </div>
      </div>

      <hr />
    </main>
  );
}
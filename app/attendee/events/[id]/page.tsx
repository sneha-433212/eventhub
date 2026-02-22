"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useAuthGuard } from "@/lib/useAuthGuard";
import styles from "./styles/EventDetails.module.css";

export default function EventDetailsPage() {
  useAuthGuard("attendee");
  const router = useRouter();

  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [event, setEvent] = useState<any>(null);
  const [regId, setRegId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        let user = null;

        if (token) {
          try {
            user = JSON.parse(token);
          } catch {}
        }

        const res = await axios.get(`/api/events/${id}`);
        if (res.data.status === "OK") {
          setEvent(res.data.result);
        }

        if (user) {
          const resReg = await axios.get(
            `/api/registrations?eventId=${id}`
          );
          if (resReg.data.status === "OK") {
            const list = resReg.data.result || [];
            const mine = list.find(
              (r: any) =>
                Number(r.userId) === Number(user.id) &&
                r.status === "registered"
            );
            if (mine) setRegId(mine.id);
          }
        }
      } catch (err) {
        console.error("Failed to load", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadData();
  }, [id]);

  const handleAction = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let user;
    try {
      user = JSON.parse(token);
    } catch {
      return;
    }

    setProcessing(true);
    try {
      if (regId) {
        if (!confirm("Cancel registration?")) {
          setProcessing(false);
          return;
        }
        const res = await axios.delete(`/api/registrations/${regId}`);
        if (res.data.status === "OK") {
          setRegId(null);
          alert("Cancelled!");
        }
      } else {
        const res = await axios.post("/api/registrations", {
          eventId: id,
          userId: user.id,
        });
        if (res.data.status === "OK") {
          setRegId(res.data.result.id);
          alert("Joined!");
        }
      }
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (!loading && !event) {
      router.replace("/not-found");
    }
  }, [loading, event, router]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div
            style={{
              width: "380px",
              height: "240px",
              background: "#e5e7eb",
              borderRadius: "10px",
            }}
          />
          <div style={{ flex: 1 }}>
            <div
              style={{
                height: "28px",
                width: "70%",
                background: "#e5e7eb",
                borderRadius: "6px",
                marginBottom: "14px",
              }}
            />
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: "16px",
                  background: "#e5e7eb",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  width: i === 4 ? "60%" : "100%",
                }}
              />
            ))}
            <div
              style={{
                height: "44px",
                width: "180px",
                background: "#e5e7eb",
                borderRadius: "6px",
                marginTop: "16px",
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        {event?.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className={styles.image}
          />
        )}

        <div className={styles.details}>
          <h1 className={styles.title}>{event?.title}</h1>

          <p className={styles.description}>{event?.description}</p>

          <p className={styles.meta}>
            <strong>Location:</strong> {event?.location}
          </p>

          <p className={styles.meta}>
            <strong>Date:</strong>{" "}
            {event?.eventDate
              ? new Date(event.eventDate).toLocaleString()
              : ""}
          </p>

          <button
            onClick={handleAction}
            disabled={processing}
            className={`${styles.button} ${
              regId ? styles.cancel : styles.join
            } ${processing ? styles.disabled : ""}`}
          >
            {processing
              ? "Please wait..."
              : regId
              ? "Cancel Registration"
              : "Join Event"}
          </button>
        </div>
      </div>
    </div>
  );
}
import styles from "../styles/EventCard.module.css";
import Link from "next/link";

export default function EventCard({ event }: { event: any }) {
  const eventDate =
    event?.eventDate && !isNaN(Date.parse(event.eventDate))
      ? new Date(event.eventDate)
      : null;

  const day = eventDate
    ? eventDate.toLocaleDateString("en-GB", { day: "2-digit" })
    : "00";

  const monthYear = eventDate
    ? eventDate.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const formattedTime = eventDate
    ? eventDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <Link
      href={`/attendee/events/${event?.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div className={styles.card}>
        <div className={styles.topRow}>
          <div className={styles.dateBlock}>
            <div className={styles.day}>{day}</div>
            <div className={styles.redLine}></div>
          </div>

          <div className={styles.time}>{formattedTime}</div>
        </div>

        <div className={styles.monthYear}>{monthYear}</div>

        <h4 className={styles.title}>{event?.title}</h4>
        <p className={styles.location}>{event?.location}</p>

        {event?.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.title}
            className={styles.image}
            loading="lazy"
          />
        )}
      </div>
    </Link>
  );
}
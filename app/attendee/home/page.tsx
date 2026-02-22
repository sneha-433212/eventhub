"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./components/EventCard";
import styles from "@/app/attendee/home/styles/Home.module.css";
import { useAuthGuard } from "@/lib/useAuthGuard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function AttendeeHome() {
  useAuthGuard("attendee");

  const [events, setEvents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState("all");
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await axios.get("/api/categories");
        if (res.data?.status === "OK") {
          setCategories(res.data.result || []);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);

        const res = await axios.get("/api/events", {
          params: {
            categoryId: selectedCategory || undefined,
            date: selectedDate || undefined,
          },
          headers: { "Cache-Control": "no-cache" },
        });

        if (res.data?.status === "OK") {
          const all = res.data.result || [];

          let filtered = all;

          if (eventFilter === "upcoming") {
            filtered = all.filter(
              (e: any) =>
                e.eventDate && new Date(e.eventDate) > new Date()
            );
          }

          if (eventFilter === "past") {
            filtered = all.filter(
              (e: any) =>
                e.eventDate && new Date(e.eventDate) <= new Date()
            );
          }

          setEvents(filtered);
        }
      } catch (error) {
        console.error("Failed to load events", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [selectedCategory, selectedDate, eventFilter]);

  function EventSkeleton() {
    return (
      <>
        <Skeleton height={180} borderRadius={10} />
        <Skeleton height={20} width="60%" style={{ marginTop: 10 }} />
        <Skeleton height={15} width="40%" />
      </>
    );
  }

  return (
    <>
      <h2 className={styles.heading}> My Events </h2>

      <div className={styles.filterBar}>

        <div className={styles.dropdown}>
          <div
            className={styles.dropdownHeader}
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedCategory
              ? categories.find((c) => String(c.id) === String(selectedCategory))?.name
              : "All Categories"} ▼
          </div>

          {isOpen && (
            <ul className={styles.dropdownMenu}>
              <li
                onClick={() => {
                  setSelectedCategory("");
                  setIsOpen(false);
                }}
              >
                All Categories
              </li>

              {categories.map((cat) => (
                <li
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setIsOpen(false);
                  }}
                >
                  {cat.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.dateWrapper}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.dropdown}>
          <div
            className={styles.dropdownHeader}
            onClick={() => setIsEventOpen(!isEventOpen)}
          >
            {eventFilter === "all" && "All Events"}
            {eventFilter === "upcoming" && "Upcoming"}
            {eventFilter === "past" && "Past"} ▼
          </div>

          {isEventOpen && (
            <ul className={styles.dropdownMenu}>
              <li onClick={() => { setEventFilter("all"); setIsEventOpen(false); }}>
                All Events
              </li>
              <li onClick={() => { setEventFilter("upcoming"); setIsEventOpen(false); }}>
                Upcoming
              </li>
              <li onClick={() => { setEventFilter("past"); setIsEventOpen(false); }}>
                Past Events
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.eventGrid}>
          {loading ? (
            <>
              <EventSkeleton />
              <EventSkeleton />
              <EventSkeleton />
            </>
          ) : events.length === 0 ? (
            <p>No events found.</p>
          ) : (
            events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </>
  );
}
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import styles from "../styles/registrations.module.css";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const columns = [
    {
      name: "Attendee Name",
      selector: (row: any) => row.userName || "N/A",
      sortable: true,
    },
    {
      name: "User ID",
      selector: (row: any) => row.userId,
      sortable: true,
    },
    {
      name: "Event Title",
      selector: (row: any) => row.event?.title || "N/A",
      sortable: true,
    },
    {
      name: "Status",
      selector: (row: any) => row.status,
      sortable: true,
      width: "140px",
      cell: (row: any) => {
        const isRegistered = row.status === "registered";
        return (
          <span
            style={{
              padding: "2px 8px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              backgroundColor: isRegistered ? "#dcfce7" : "#fee2e2",
              color: isRegistered ? "#166534" : "#991b1b",
              border: `1px solid ${isRegistered ? "#bbf7d0" : "#fecaca"}`,
              textAlign: "center",
              minWidth: "85px",
              whiteSpace: "nowrap",
            }}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      name: "Registered At",
      selector: (row: any) => row.registeredAt,
      sortable: true,
      cell: (row: any) =>
        row.status === "registered" && row.registeredAt
          ? new Date(row.registeredAt).toLocaleString()
          : " - ",
    },
    {
      name: "Cancelled At",
      selector: (row: any) => row.cancelledAt,
      sortable: true,
      cell: (row: any) =>
        row.status === "cancelled" && row.cancelledAt
          ? new Date(row.cancelledAt).toLocaleString()
          : " - ",
    },
  ];

  useEffect(() => {
    async function fetchRegs() {
      try {
        const res = await axios.get("/api/registrations");
        if (res.data.status === "OK")
          setRegistrations(res.data.result || []);
      } catch (error) {
        console.error("Failed to load registrations", error);
      } finally {
        setLoading(false);
      }
    }
    fetchRegs();
  }, []);

  const filteredData = registrations.filter((item: any) => {
    const userName = item.userName?.toLowerCase() || "";
    const title = item.event?.title?.toLowerCase() || "";
    const userId = item.userId?.toString() || "";

    const matchesSearch =
      userName.includes(filterText.toLowerCase()) ||
      title.includes(filterText.toLowerCase()) ||
      userId.includes(filterText);

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const matchesDate =
      !selectedDate ||
      (item.registeredAt &&
        new Date(item.registeredAt)
          .toISOString()
          .split("T")[0] === selectedDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>Registrations</h1>

      <div className={styles.tableCard}>
        <div className={styles.toolbar}>
          <input
            type="text"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className={`${styles.inputField} ${styles.searchInput}`}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.inputField}
          >
            <option value="all">All Status</option>
            <option value="registered">Registered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className={styles.inputField}
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
          paginationPerPage={8}
          paginationRowsPerPageOptions={[8, 16, 24]}
          highlightOnHover
          customStyles={{
            headRow: { style: { backgroundColor: "#f8fafc" } },
            headCells: {
              style: {
                fontSize: "15px",
                fontWeight: "700",
                color: "#111827",
              },
            },
            rows: {
              style: {
                fontSize: "14px",
                minHeight: "45px",
              },
            },
          }}
          noDataComponent={
            <div style={{ padding: "24px" }}>
              No matching registrations found.
            </div>
          }
        />
      </div>
    </main>
  );
}
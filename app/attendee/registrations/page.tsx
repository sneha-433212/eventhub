// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import DataTable from "react-data-table-component";
// import styles from "../../organizer/styles/registrations.module.css";

// export default function MyRegistrationsPage() {
//   const [registrations, setRegistrations] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filterText, setFilterText] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
// const [selectedDate, setSelectedDate] = useState("");


//   const columns = [
//     {
//       name: "Event Title",
//       selector: (row: any) => row.event?.title || "Untitled Event",
//       sortable: true,
//       grow: 2,
//     },

//     {
//       name: "Event Date",
//       selector: (row: any) => row.event?.eventDate,
//       sortable: true,
//       cell: (row: any) =>
//         row.event?.eventDate
//           ? new Date(row.event.eventDate).toLocaleDateString()
//           : "N/A",
//     },
//     {
//       name: "Event Time",
//       selector: (row: any) => row.event?.eventDate,
//       sortable: true,
//       cell: (row: any) =>
//         row.event?.eventDate
//           ? new Date(row.event.eventDate).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })
//           : "N/A",
//     },
//     {
//       name: "Status",
//       selector: (row: any) => row.status,
//       sortable: true,
//       width: "140px", // ⭐ prevents badge break
//       cell: (row: any) => {
//         const isRegistered = row.status === "registered";
//         return (
//           <span
//             style={{
//               padding: "2px 8px",
//               borderRadius: "4px",
//               fontSize: "10px",
//               fontWeight: "600",
//               textTransform: "uppercase",
//               letterSpacing: "0.5px",
//               backgroundColor: isRegistered ? "#dcfce7" : "#fee2e2",
//               color: isRegistered ? "#166534" : "#991b1b",
//               border: `1px solid ${isRegistered ? "#bbf7d0" : "#fecaca"}`,
//               display: "inline-block",
//               textAlign: "center",
//               minWidth: "85px",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {row.status}
//           </span>
//         );
//       },
//     },
//     {
//       name: "Action",
//       width: "140px", // ⭐ balances table spacing
//       cell: (row: any) =>
//         row.status === "registered" ? (
//           <button
//             onClick={() => cancelRegistration(row.id)}
//             style={{
//               backgroundColor: "#ef4444",
//               color: "white",
//               padding: "6px 12px",
//               borderRadius: "4px",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "12px",
//             }}
//           >
//             Cancel
//           </button>
//         ) : (
//           <span
//             style={{
//               color: "#94a3b8",
//               fontSize: "12px",
//               fontStyle: "italic",
//             }}
//           >
//             No Action
//           </span>
//         ),
//     },
//   ];

//   useEffect(() => {
//     async function fetchRegistrations() {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;
//         const user = JSON.parse(token);

//         const res = await axios.get(`/api/registrations?userId=${user.id}`);

//         if (res.data.status === "OK") {
//           const sortedData = (res.data.result || []).sort(
//             (a: any, b: any) => b.id - a.id
//           );
//           setRegistrations(sortedData);
//         }
//       } catch (err) {
//         console.error("Failed to fetch registrations", err);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchRegistrations();
//   }, []);

//   async function cancelRegistration(registrationId: number) {
//     if (!confirm("Are you sure you want to cancel?")) return;

//     try {
//       const res = await axios.delete(`/api/registrations/${registrationId}`);

//       if (res.data.status === "OK") {
//         setRegistrations((prev) =>
//           prev.map((r) =>
//             r.id === registrationId ? { ...r, status: "cancelled" } : r
//           )
//         );
//         alert("Registration cancelled successfully!");
//       }
//     } catch (err) {
//       alert("Failed to cancel registration.");
//     }
//   }

//  const filteredData = registrations.filter((item: any) => {
//   const matchesSearch =
//     item.event?.title?.toLowerCase().includes(filterText.toLowerCase()) ||
//     item.event?.location?.toLowerCase().includes(filterText.toLowerCase());

//   const matchesStatus =
//     statusFilter === "all" || item.status === statusFilter;

//   const matchesDate =
//     !selectedDate ||
//     new Date(item.event?.eventDate)
//       .toISOString()
//       .split("T")[0] === selectedDate;

//   return matchesSearch && matchesStatus && matchesDate;
// });


//   return (
//     <main className={styles.container}>
//       <h1 className={styles.heading}>My Registrations</h1>

//       <div className={styles.tableCard}>
//         <div className={styles.toolbar}>
 
//   <input
//     type="text"
//     placeholder="Search..."
//     value={filterText}
//     onChange={(e) => setFilterText(e.target.value)}
//     className={`${styles.inputField} ${styles.searchInput}`}
//   />


//   <select
//     value={statusFilter}
//     onChange={(e) => setStatusFilter(e.target.value)}
//     className={styles.inputField}
//   >
//     <option value="all">All Status</option>
//     <option value="registered">Registered</option>
//     <option value="cancelled">Cancelled</option>
//   </select>


//   <input
//     type="date"
//     value={selectedDate}
//     onChange={(e) => setSelectedDate(e.target.value)}
//     className={styles.inputField}
//   />
// </div>


//         <DataTable
//           columns={columns}
//           data={filteredData}
//           progressPending={loading}
//           pagination
//           paginationPerPage={8}
//           paginationRowsPerPageOptions={[8, 16, 24]}
//           highlightOnHover
//           customStyles={{
//             headRow: {
//               style: { backgroundColor: "#f8fafc" },
//             },
//             headCells: {
//               style: {
//                 fontSize: "15px",
//                 fontWeight: "700",
//                 color: "#111827",
//               },
//             },
//             rows: {
//               style: {
//                 fontSize: "14px",
//                 minHeight: "45px",
//               },
//             },
//           }}
//           noDataComponent={
//             <div style={{ padding: "24px" }}>
//               No registrations found.
//             </div>
//           }
//         />
//       </div>
//     </main>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import styles from "../../organizer/styles/registrations.module.css";

export default function MyRegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  const columns = [
    {
      name: "Event Title",
      selector: (row: any) => row.event?.title || "Untitled Event",
      sortable: true,
      grow: 2,
    },
    {
      name: "Event Date",
      selector: (row: any) => row.event?.eventDate,
      sortable: true,
      cell: (row: any) =>
        row.event?.eventDate
          ? new Date(row.event.eventDate).toLocaleDateString()
          : "N/A",
    },
    {
      name: "Event Time",
      selector: (row: any) => row.event?.eventDate,
      sortable: true,
      cell: (row: any) =>
        row.event?.eventDate
          ? new Date(row.event.eventDate).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
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
              display: "inline-block",
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
      name: "Action",
      width: "140px",
      cell: (row: any) =>
        row.status === "registered" ? (
          <button
            onClick={() => cancelRegistration(row.id)}
            style={{
              backgroundColor: "#ef4444",
              color: "white",
              padding: "6px 12px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            Cancel
          </button>
        ) : (
          <span
            style={{
              color: "#94a3b8",
              fontSize: "12px",
              fontStyle: "italic",
            }}
          >
            No Action
          </span>
        ),
    },
  ];

  useEffect(() => {
    async function fetchRegistrations() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        let user;
        try {
          user = JSON.parse(token);
        } catch {
          return;
        }

        const res = await axios.get(`/api/registrations?userId=${user.id}`);

        if (res.data.status === "OK") {
          const sortedData = (res.data.result || []).sort(
            (a: any, b: any) => b.id - a.id
          );
          setRegistrations(sortedData);
        }
      } catch (err) {
        console.error("Failed to fetch registrations", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRegistrations();
  }, []);

  async function cancelRegistration(registrationId: number) {
    if (!confirm("Are you sure you want to cancel?")) return;

    try {
      const res = await axios.delete(`/api/registrations/${registrationId}`);

      if (res.data.status === "OK") {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === registrationId ? { ...r, status: "cancelled" } : r
          )
        );
        alert("Registration cancelled successfully!");
      }
    } catch (err) {
      alert("Failed to cancel registration.");
    }
  }

  const filteredData = registrations.filter((item: any) => {
    const title = item.event?.title?.toLowerCase() || "";
    const location = item.event?.location?.toLowerCase() || "";

    const matchesSearch =
      title.includes(filterText.toLowerCase()) ||
      location.includes(filterText.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const matchesDate =
      !selectedDate ||
      (item.event?.eventDate &&
        new Date(item.event.eventDate)
          .toISOString()
          .split("T")[0] === selectedDate);

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <main className={styles.container}>
      <h1 className={styles.heading}>My Registrations</h1>

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
            rows: { style: { fontSize: "14px", minHeight: "45px" } },
          }}
          noDataComponent={
            <div style={{ padding: "24px" }}>
              No registrations found.
            </div>
          }
        />
      </div>
    </main>
  );
}


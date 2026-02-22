// "use client";
// export const dynamic = "force-dynamic";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useAuthGuard } from "@/lib/useAuthGuard";
// import styles from "../styles/eventForm.module.css";
// import dynamicImport from "next/dynamic";

// const MapPicker = dynamicImport(
//   () => import("../components/MapPicker"),
//   { ssr: false }
// );

// export default function CreateEventPage() {
//   useAuthGuard("organizer");

//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const eventId = searchParams.get("id");
//   const isEditMode = Boolean(eventId);

//   const [categories, setCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [location, setLocation] = useState("");
//   const [eventDate, setEventDate] = useState("");
//   const [capacity, setCapacity] = useState(10);
//   const [categoryId, setCategoryId] = useState("");
//   const [imageFile, setImageFile] = useState<File | null>(null);

//   const [titleError, setTitleError] = useState("");
//   const [descriptionError, setDescriptionError] = useState("");
//   const [locationError, setLocationError] = useState("");
//   const [dateError, setDateError] = useState("");
//   const [capacityError, setCapacityError] = useState("");
//   const [categoryError, setCategoryError] = useState("");
//   const [imageError, setImageError] = useState("");

//   const validateTitle = (value: string) => {
//     const v = value.trim();
//     if (!v) setTitleError("Title is required");
//     else if (v.length < 5 || v.length > 200)
//       setTitleError("Title must be 5–200 characters");
//     else setTitleError("");
//   };

//   const validateDescription = (value: string) => {
//     if (!value.trim())
//       setDescriptionError("Description is required");
//     else if (value.trim().length < 20)
//       setDescriptionError("Description must be at least 20 characters");
//     else setDescriptionError("");
//   };

//   const validateLocation = (value: string) => {
//     if (!value.trim()) setLocationError("Location is required");
//     else setLocationError("");
//   };

//   const validateDate = (value: string) => {
//     if (!value) setDateError("Event date is required");
//     else if (new Date(value).getTime() <= Date.now())
//       setDateError("Event date must be in the future");
//     else setDateError("");
//   };

//   const validateCapacity = (value: number) => {
//     if (value < 1) setCapacityError("Capacity must be at least 1");
//     else setCapacityError("");
//   };

//   const validateCategory = (value: string) => {
//     if (!value) setCategoryError("Category is required");
//     else setCategoryError("");
//   };

//   const validateImage = (file: File | null) => {
//     if (!file) {
//       setImageError("");
//       return;
//     }
//     const allowed = ["image/jpeg", "image/png", "image/webp"];
//     if (!allowed.includes(file.type))
//       setImageError("Only JPG, PNG, or WebP images allowed");
//     else if (file.size > 5 * 1024 * 1024)
//       setImageError("Image size must be less than 5MB");
//     else setImageError("");
//   };

//   useEffect(() => {
//     async function fetchCategories() {
//       try {
//         const res = await axios.get("/api/categories");
//         if (res.data?.status === "OK") {
//           setCategories(res.data.result || []);
//         }
//       } catch {
//         console.error("Failed to load categories");
//       }
//     }
//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     if (!eventId) {
//       setLoading(false);
//       return;
//     }

//     async function loadEvent() {
//       try {
//         const res = await axios.get(`/api/events/${eventId}`);
//         const event = res.data?.result;
//         if (!event) return;

//         setTitle(event.title || "");
//         setDescription(event.description || "");
//         setLocation(event.location || "");
//         setEventDate(event.eventDate ? event.eventDate.slice(0, 16) : "");
//         setCapacity(event.capacity || 1);
//         setCategoryId(String(event.categoryId || ""));
//       } catch {
//         alert("Failed to load event");
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadEvent();
//   }, [eventId]);

//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
//     setSubmitting(true);

//     const token = localStorage.getItem("token");
//     if (!token) {
//       alert("Please login first");
//       setSubmitting(false);
//       return;
//     }

//     let user;
//     try {
//       user = JSON.parse(token);
//     } catch {
//       alert("Session expired. Please login again.");
//       setSubmitting(false);
//       return;
//     }

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("location", location);
//     formData.append("eventDate", eventDate);
//     formData.append("capacity", String(capacity));
//     formData.append("categoryId", categoryId);
//     formData.append("organizerId", user.id);

//     if (imageFile) formData.append("image", imageFile);

//     try {
//       if (isEditMode) {
//         await axios.put(`/api/events/${eventId}`, formData);
//       } else {
//         await axios.post("/api/events", formData);
//       }
//       router.push("/organizer/dashboard");
//     } catch {
//       alert(isEditMode ? "Failed to update event" : "Failed to create event");
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (loading) return <p>Loading...</p>;


//   return (
//     <main className={styles.page}>
//       <div className={styles.card}>
//         <h1 className={styles.title}>
//           {isEditMode ? "Edit Event" : "Create Event"}
//         </h1>
//         <form className={styles.form} onSubmit={handleSubmit}>
//           <input
//             className={styles.input}
//             placeholder="Title"
//             value={title}
//             onChange={(e) => {
//               setTitle(e.target.value);
//               validateTitle(e.target.value);
//             }}
//           />
//           {titleError && <p className={styles.errorText}>{titleError}</p>}

//           <textarea
//             className={styles.textarea}
//             placeholder="Description"
//             value={description}
//             onChange={(e) => {
//               setDescription(e.target.value);
//               validateDescription(e.target.value);
//             }}
//           />
//           {descriptionError && (
//             <p className={styles.errorText}>{descriptionError}</p>
//           )}

//           <input
//             className={styles.input}
//             placeholder="Location"
//             value={location}
//             onChange={(e) => {
//               setLocation(e.target.value);
//               validateLocation(e.target.value);
//             }}
//           />
//           {locationError && <p className={styles.errorText}>{locationError}</p>}


//           <MapPicker
//             setLocation={setLocation}
//             value={location}
//           />


//           <input
//             className={styles.input}
//             type="datetime-local"
//             value={eventDate}
//             onChange={(e) => {
//               setEventDate(e.target.value);
//               validateDate(e.target.value);
//             }}
//           />
//           {dateError && <p className={styles.errorText}>{dateError}</p>}

//           <input
//             className={styles.input}
//             type="text"
//             inputMode="numeric"
//             pattern="[0-9]*"
//             value={capacity}
//             onChange={(e) => {
//               const value = e.target.value.replace(/\D/g, ""); // allow digits only
//               const num = value ? Number(value) : 0;
//               setCapacity(num);
//               validateCapacity(num);
//             }}
//           />


//           {capacityError && <p className={styles.errorText}>{capacityError}</p>}

//           <select
//             className={styles.select}
//             value={categoryId}
//             onChange={(e) => {
//               setCategoryId(e.target.value);
//               validateCategory(e.target.value);
//             }}
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat) => (
//               <option key={cat.id} value={cat.id}>
//                 {cat.name}
//               </option>
//             ))}
//           </select>
//           {categoryError && <p className={styles.errorText}>{categoryError}</p>}

//           <input
//             className={styles.fileInput}
//             type="file"
//             accept="image/*"
//             onChange={(e) => {
//               const file = e.target.files?.[0] || null;
//               setImageFile(file);
//               validateImage(file);
//             }}
//           />
//           {imageError && <p className={styles.errorText}>{imageError}</p>}

//           <button
//             className={styles.button}
//             type="submit"
//             disabled={
//               submitting ||
//               !!titleError ||
//               !!descriptionError ||
//               !!locationError ||
//               !!dateError ||
//               !!capacityError ||
//               !!categoryError ||
//               !!imageError
//             }
//           >
//             {submitting
//               ? isEditMode
//                 ? "Updating..."
//                 : "Creating..."
//               : isEditMode
//                 ? "Update Event"
//                 : "Create Event"}
//           </button>
//         </form>
//       </div>
//     </main>
//   );
// }



"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthGuard } from "@/lib/useAuthGuard";
import styles from "../styles/eventForm.module.css";
import dynamicImport from "next/dynamic";

const MapPicker = dynamicImport(
  () => import("../components/MapPicker"),
  { ssr: false }
);

function CreateEventPageContent() {
  useAuthGuard("organizer");

  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const isEditMode = Boolean(eventId);

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [capacity, setCapacity] = useState(10);
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [titleError, setTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [dateError, setDateError] = useState("");
  const [capacityError, setCapacityError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [imageError, setImageError] = useState("");

  const validateTitle = (value: string) => {
    const v = value.trim();
    if (!v) setTitleError("Title is required");
    else if (v.length < 5 || v.length > 200)
      setTitleError("Title must be 5–200 characters");
    else setTitleError("");
  };

  const validateDescription = (value: string) => {
    if (!value.trim())
      setDescriptionError("Description is required");
    else if (value.trim().length < 20)
      setDescriptionError("Description must be at least 20 characters");
    else setDescriptionError("");
  };

  const validateLocation = (value: string) => {
    if (!value.trim()) setLocationError("Location is required");
    else setLocationError("");
  };

  const validateDate = (value: string) => {
    if (!value) setDateError("Event date is required");
    else if (new Date(value).getTime() <= Date.now())
      setDateError("Event date must be in the future");
    else setDateError("");
  };

  const validateCapacity = (value: number) => {
    if (value < 1) setCapacityError("Capacity must be at least 1");
    else setCapacityError("");
  };

  const validateCategory = (value: string) => {
    if (!value) setCategoryError("Category is required");
    else setCategoryError("");
  };

  const validateImage = (file: File | null) => {
    if (!file) {
      setImageError("");
      return;
    }
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type))
      setImageError("Only JPG, PNG, or WebP images allowed");
    else if (file.size > 5 * 1024 * 1024)
      setImageError("Image size must be less than 5MB");
    else setImageError("");
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get("/api/categories");
        if (res.data?.status === "OK") {
          setCategories(res.data.result || []);
        }
      } catch {
        console.error("Failed to load categories");
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }

    async function loadEvent() {
      try {
        const res = await axios.get(`/api/events/${eventId}`);
        const event = res.data?.result;
        if (!event) return;

        setTitle(event.title || "");
        setDescription(event.description || "");
        setLocation(event.location || "");
        setEventDate(event.eventDate ? event.eventDate.slice(0, 16) : "");
        setCapacity(event.capacity || 1);
        setCategoryId(String(event.categoryId || ""));
      } catch {
        alert("Failed to load event");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      setSubmitting(false);
      return;
    }

    let user;
    try {
      user = JSON.parse(token);
    } catch {
      alert("Session expired. Please login again.");
      setSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("eventDate", eventDate);
    formData.append("capacity", String(capacity));
    formData.append("categoryId", categoryId);
    formData.append("organizerId", user.id);

    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEditMode) {
        await axios.put(`/api/events/${eventId}`, formData);
      } else {
        await axios.post("/api/events", formData);
      }
      router.push("/organizer/dashboard");
    } catch {
      alert(isEditMode ? "Failed to update event" : "Failed to create event");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          {isEditMode ? "Edit Event" : "Create Event"}
        </h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.input}
            placeholder="Title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              validateTitle(e.target.value);
            }}
          />
          {titleError && <p className={styles.errorText}>{titleError}</p>}

          <textarea
            className={styles.textarea}
            placeholder="Description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              validateDescription(e.target.value);
            }}
          />
          {descriptionError && (
            <p className={styles.errorText}>{descriptionError}</p>
          )}

          <input
            className={styles.input}
            placeholder="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              validateLocation(e.target.value);
            }}
          />
          {locationError && <p className={styles.errorText}>{locationError}</p>}

          <MapPicker setLocation={setLocation} value={location} />

          <input
            className={styles.input}
            type="datetime-local"
            value={eventDate}
            onChange={(e) => {
              setEventDate(e.target.value);
              validateDate(e.target.value);
            }}
          />
          {dateError && <p className={styles.errorText}>{dateError}</p>}

          <input
            className={styles.input}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={capacity}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              const num = value ? Number(value) : 0;
              setCapacity(num);
              validateCapacity(num);
            }}
          />
          {capacityError && <p className={styles.errorText}>{capacityError}</p>}

          <select
            className={styles.select}
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              validateCategory(e.target.value);
            }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {categoryError && <p className={styles.errorText}>{categoryError}</p>}

          <input
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setImageFile(file);
              validateImage(file);
            }}
          />
          {imageError && <p className={styles.errorText}>{imageError}</p>}

          <button
            className={styles.button}
            type="submit"
            disabled={
              submitting ||
              !!titleError ||
              !!descriptionError ||
              !!locationError ||
              !!dateError ||
              !!capacityError ||
              !!categoryError ||
              !!imageError
            }
          >
            {submitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Event"
              : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <CreateEventPageContent />
    </Suspense>
  );
}






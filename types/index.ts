export interface User {
  id: string | number;
  name: string;
  email: string;
  role: "organizer" | "attendee";
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string | number;
  name: string;
  description?: string;
  createdAt?: string;
}


export interface Event {
  id: string | number;
  organizerId: string | number;
  categoryId: string | number;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  capacity: number;
  status: "draft" | "published" | "cancelled" | "completed";
  imageUrl?: string;
  createdAt?: string;
}

export interface Registration {
  id: string | number;
  eventId: string | number;
  userId: string | number;
  status: "registered" | "cancelled" | "attended";
  registeredAt: string;
  cancelledAt?: string;
}

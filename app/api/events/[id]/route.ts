import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();

    const event = (db.events || []).find(
      (e: any) => String(e.id) === id
    );

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    const category = db.categories?.find(
      (c: any) => String(c.id) === String(event.categoryId)
    );

    const registeredCount = (db.registrations || []).filter(
      (r: any) =>
        String(r.eventId) === String(event.id) &&
        r.status === "registered"
    ).length;

    let status = event.status || "draft";

    if (event.completedAt) {
      status = "completed";
    } else if (event.cancelledAt) {
      status = "cancelled";
    } else if (event.eventDate && new Date(event.eventDate) < new Date()) {
      status = "completed";
    }

    return NextResponse.json(
      {
        status: "OK",
        result: {
          ...event,
          category,
          registeredCount,
          status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();

    const formData = await req.formData();

    const currentUserId = Number(formData.get("organizerId"));
    const newStatus = formData.get("status") as string | null;

    const index = (db.events || []).findIndex(
      (e: any) => String(e.id) === id
    );

    if (index === -1) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    const event = db.events[index];

    if (event.organizerId !== currentUserId) {
      return NextResponse.json(
        { message: "Unauthorized: You do not own this event" },
        { status: 403 }
      );
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const location = formData.get("location") as string;
    const eventDate = formData.get("eventDate") as string;
    const capacity = Number(formData.get("capacity"));
    const categoryId = formData.get("categoryId") as string;
    const image = formData.get("image") as File | null;

    let imageUrl = event.imageUrl;

    if (image && image.size > 0) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = `data:${image.type};base64,${buffer.toString("base64")}`;
      const upload = await uploadToCloudinary(base64Image);
      imageUrl = upload.secure_url;
    }

    const updatedEvent = {
      ...event,
      title: title || event.title,
      description: description || event.description,
      location: location || event.location,
      eventDate: eventDate || event.eventDate,
      capacity: capacity || event.capacity,
      categoryId: categoryId || event.categoryId,
      imageUrl,
      status: newStatus || event.status,
      cancelledAt:
        newStatus === "cancelled"
          ? new Date().toISOString()
          : event.cancelledAt || null,
      completedAt:
        newStatus === "completed"
          ? new Date().toISOString()
          : event.completedAt || null,
      updatedAt: new Date().toISOString(),
    };

    db.events[index] = updatedEvent;
    await saveDb(db);

    return NextResponse.json(
      { status: "OK", result: updatedEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { status: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();

    const { searchParams } = new URL(req.url);
    const currentUserId = Number(searchParams.get("organizerId"));

    const index = (db.events || []).findIndex(
      (e: any) => String(e.id) === id
    );

    if (index === -1) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    if (db.events[index].organizerId !== currentUserId) {
      return NextResponse.json(
        { message: "Unauthorized: You do not own this event" },
        { status: 403 }
      );
    }

    db.events.splice(index, 1);

    db.registrations = (db.registrations || []).filter(
      (r: any) => String(r.eventId) !== String(id)
    );

    await saveDb(db);

    return NextResponse.json(
      { status: "OK", message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to delete event" },
      { status: 500 }
    );
  }
}
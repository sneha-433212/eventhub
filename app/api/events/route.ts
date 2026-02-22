import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const date = searchParams.get("date");

    let events = (db.events || []).map((event: any) => {
      const totalRegistered = (db.registrations || []).filter(
        (r: any) =>
          String(r.eventId) === String(event.id) &&
          r.status === "registered"
      ).length;

      return {
        ...event,
        registeredCount: totalRegistered,
      };
    });

    if (categoryId) {
      events = events.filter(
        (e: any) => String(e.categoryId) === String(categoryId)
      );
    }

    if (date) {
      events = events.filter((e: any) => {
        if (!e.eventDate) return false;
        return (
          new Date(e.eventDate).toISOString().split("T")[0] === date
        );
      });
    }

    return NextResponse.json(
      { status: "OK", result: events },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "failed", message: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const title = data.get("title") as string;
    const description = data.get("description") as string;
    const location = data.get("location") as string;
    const eventDate = data.get("eventDate") as string;
    const capacity = Number(data.get("capacity"));
    const categoryId = data.get("categoryId") as string;
    const image = data.get("image") as File | null;
    const organizerId = data.get("organizerId");

    if (!organizerId) {
      return NextResponse.json(
        { message: "Organizer ID is required" },
        { status: 400 }
      );
    }

    const db = await getDb();

    let imageUrl: string | null = null;

    if (image && image.size > 0) {
      const byteData = await image.arrayBuffer();
      const buffer = Buffer.from(byteData);
      const fileUri = `data:${image.type};base64,${buffer.toString("base64")}`;

      const uploadResult = await uploadToCloudinary(fileUri);
      imageUrl = uploadResult.secure_url;
    }

    const newEvent = {
      id: Date.now(),
      organizerId: Number(organizerId),
      categoryId,
      title,
      description,
      location,
      eventDate,
      capacity,
      registeredCount: 0,
      status: "published",
      imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.events.push(newEvent);
    await saveDb(db);

    revalidatePath("/events");

    return NextResponse.json(
      { status: "OK", result: newEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { status: "failed", message: "Server Error" },
      { status: 500 }
    );
  }
}
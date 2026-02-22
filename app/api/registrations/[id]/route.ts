import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDb();

    const registrations = db.registrations || [];

    const index = registrations.findIndex(
      (r: { id: string | number }) => String(r.id) === String(id)
    );

    if (index === -1) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    registrations[index].status = "cancelled";
    registrations[index].cancelledAt = new Date().toISOString();

    db.registrations = registrations;

    await saveDb(db);
    return NextResponse.json({ status: "OK" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ status: "ERROR" }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const userId = searchParams.get("userId");

    const db = await getDb();
    let results = db.registrations || [];

    if (eventId) {
      results = results.filter(
        (r: { eventId: string | number }) =>
          String(r.eventId) === eventId
      );
    }

    if (userId) {
      results = results.filter(
        (r: { userId: string | number }) =>
          String(r.userId) === userId
      );
    }

    const finalResults = results.map((reg: any) => {
      const eventDetail = db.events.find(
        (e: any) => String(e.id) === String(reg.eventId)
      );

      const userDetail = db.users.find(
        (u: any) => String(u.id) === String(reg.userId)
      );

      return {
        ...reg,
        event: eventDetail || null,
        userName: userDetail ? userDetail.name : `User ${reg.userId}`,
      };
    });

    return NextResponse.json(
      { status: "OK", result: finalResults },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "ERROR", message: "Failed to fetch" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = await getDb();

    const event = db.events.find(
      (e: any) => String(e.id) === String(body.eventId)
    );

    const attendee = db.users.find(
      (u: any) => String(u.id) === String(body.userId)
    );

    const organizer = event
      ? db.users.find(
          (u: any) => String(u.id) === String(event.organizerId)
        )
      : null;

    if (event && attendee && organizer) {
      try {
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
          const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
          });

          // Mail to Attendee
          await transporter.sendMail({
            from: `"EventHub" <${process.env.EMAIL_USER}>`,
            to: attendee.email,
            subject: `Registration Confirmed: ${event.title}`,
            html: `
              <h2>Hi ${attendee.name},</h2>
              <p>You have successfully registered for <strong>${event.title}</strong>.</p>
              <p><strong>Date:</strong> ${new Date(event.eventDate).toLocaleString()}</p>
              <p><strong>Location:</strong> ${event.location}</p>
            `,
          });

          // Mail to Organizer
          await transporter.sendMail({
            from: `"EventHub" <${process.env.EMAIL_USER}>`,
            to: organizer.email,
            subject: `New Registration for ${event.title}`,
            html: `
              <h2>Hello ${organizer.name},</h2>
              <p>${attendee.name} has registered for your event <strong>${event.title}</strong>.</p>
            `,
          });
        } else {
          console.warn("Email credentials missing — skipping email send");
        }
      } catch (mailError) {
        console.error("Email sending failed:", mailError);
      }
    }

    db.registrations = db.registrations || [];

    const newReg = {
      id: Date.now(),
      eventId: body.eventId,
      userId: body.userId,
      status: "registered",
      registeredAt: new Date().toISOString(),
    };

    db.registrations.push(newReg);
    await saveDb(db);

    return NextResponse.json(
      { status: "OK", result: newReg },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { status: "ERROR", message: "Failed to join" },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { status: "failed", message: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const database = await getDb();
    const user = database.users.find(
      (u: any) => u.email.toLowerCase() === normalizedEmail
    );

    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "User not found" },
        { status: 404 }
      );
    }

    // secure 6-digit reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetToken = resetCode;
    user.resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await saveDb(database);

    const cleanLink = `http://localhost:3000/auth/reset-password`;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials missing in environment variables");
      return NextResponse.json(
        { status: "failed", message: "Email service not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // verify transporter connection
    await transporter.verify();

    await transporter.sendMail({
      from: `"EventHub" <${process.env.EMAIL_USER}>`,
      to: normalizedEmail,
      subject: "Password Reset Code",
      text: `Hello,

Click the link below to reset your password:
${cleanLink}

Your reset code is: ${resetCode}

Enter this code on the page to set a new password.

This code expires in 10 minutes.
`,
    });

    return NextResponse.json(
      { status: "OK", message: "Reset code sent to email" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { status: "failed", message: "Error sending email" },
      { status: 500 }
    );
  }
}
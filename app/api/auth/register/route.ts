import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { status: "failed", message: "All fields are required" },
        { status: 400 }
      );
    }

    const database = await getDb();

    const exists = database.users.find(
      (u: { email: string }) => u.email === email
    );

    if (exists) {
      return NextResponse.json(
        { status: "failed", message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newUser = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword,
      role: "attendee",
      isEmailVerified: false,
      otp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    };

    database.users.push(newUser);
    await saveDb(database);

    // prevent deploy crash if env missing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn("Email credentials missing — OTP email not sent");
    } else {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"EventHub" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Welcome to EventHub - Your OTP Code",
        text: `Hi ${name},\n\nThank you for registering! Your OTP code is: ${otp}.\n\nThis code will expire in 5 minutes.`,
        html: `
        <div style="font-family: Arial, sans-serif; border: 1px solid #ddd; padding: 20px;">
          <h2 style="color: #4A90E2;">Welcome, ${name}!</h2>
          <p>Thank you for joining <strong>EventHub</strong>.</p>
          <p>Your verification code is:</p>
          <h1 style="letter-spacing: 5px; color: #333;">${otp}</h1>
          <p style="font-size: 12px; color: #888;">This code expires in 5 minutes.</p>
        </div>
        `,
      });
    }

    return NextResponse.json(
      {
        status: "OK",
        result: [{ otpSent: true }],
        message: "OTP sent to user",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Register API error:", error);

    return NextResponse.json(
      { status: "failed", message: "Something went wrong" },
      { status: 500 }
    );
  }
}
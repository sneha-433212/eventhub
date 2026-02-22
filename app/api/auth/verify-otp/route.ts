import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        {
          status: "failed",
          result: [],
          message: "Email and OTP are required",
        },
        { status: 400 }
      );
    }

    const database = await getDb();
    const user = database.users.find(
      (u: { email: string; otp?: string | null; otpExpiry?: number | null }) =>
        u.email === email
    );

    if (!user) {
      return NextResponse.json(
        {
          status: "failed",
          result: [],
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        {
          status: "failed",
          result: [],
          message: "Wrong OTP",
        },
        { status: 400 }
      );
    }

    if (!user.otpExpiry || Date.now() > user.otpExpiry) {
      return NextResponse.json(
        {
          status: "failed",
          result: [],
          message: "OTP expired",
        },
        { status: 400 }
      );
    }

    user.isEmailVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const token = JSON.stringify(safeUser);

    await saveDb(database);

    return NextResponse.json(
      {
        status: "OK",
        token,
        role: user.role,
        message: "Account verified successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Verify OTP API error:", error);

    return NextResponse.json(
      {
        status: "failed",
        result: [],
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
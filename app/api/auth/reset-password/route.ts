import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db"; 
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { status: "failed", message: "Token and password are required" },
        { status: 400 }
      );
    }

    const database = await getDb();

    const user = database.users.find(
      (u: {
        resetToken?: string | null;
        resetTokenExpiry?: number | null;
      }) =>
        u.resetToken === token &&
        u.resetTokenExpiry &&
        Date.now() < u.resetTokenExpiry
    );

    if (!user) {
      return NextResponse.json(
        { status: "failed", message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    
    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        {
          status: "failed",
          message: "New password must be different from old password",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await saveDb(database);

    return NextResponse.json(
      {
        status: "OK",
        result: [{ passwordReset: true }],
        message: "Password reset successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Reset password API error:", error);
    return NextResponse.json(
      { status: "failed", message: "Something went wrong " },
      { status: 500 }
    );
  }
}
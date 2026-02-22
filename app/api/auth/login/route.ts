import { NextResponse } from "next/server";
import { getDb } from "@/lib/db"; 
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { status: "failed", message: "Email and password are required" },
        { status: 400 }
      );
    }

    const database = await getDb();
    const user = database.users.find(
      (u: { email: string; password: string; isEmailVerified: boolean; id: string | number; name: string; role: string }) =>
        u.email === email
    );

    if (!user) {
      return NextResponse.json(
        { status: "failed", result: [], message: "User not found" },
        { status: 404 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { status: "failed", result: [], message: "Wrong password" },
        { status: 401 }
      );
    }

    if (!user.isEmailVerified) {
      return NextResponse.json(
        { status: "failed", message: "Please verify your email first" },
        { status: 403 }
      );
    }

    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const mockToken = JSON.stringify(safeUser);

    return NextResponse.json(
      {
        status: "OK",
        result: [
          {
            token: mockToken,
            role: user.role,
          },
        ],
        message: "Login success",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Login API error:", error);
    return NextResponse.json(
      { status: "failed", message: "Something went wrong." },
      { status: 500 }
    );
  }
}
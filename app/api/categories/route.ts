import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

interface Category {
  id: number;
  name: string;
  description: string;
}

export async function GET() {
  try {
    const database = await getDb();

    return NextResponse.json(
      {
        status: "OK",
        result: database.categories as Category[],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "failed",
        result: [],
        message: "Something went wrong",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: Partial<Category> = await req.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        {
          status: "failed",
          result: null,
          message: "Category name is required",
        },
        { status: 400 }
      );
    }

    const database = await getDb();

    const newCategory: Category = {
      id: Date.now(),
      name: body.name.trim(),
      description: body.description ?? "",
    };

    database.categories.push(newCategory);
    await saveDb(database);

    return NextResponse.json(
      {
        status: "OK",
        result: newCategory,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "failed",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
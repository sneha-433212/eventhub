import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "lib/db.json");

export async function getDb() {
  try {
    const data = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return {};
    }

    console.error("Failed to read DB:", error);
    return {};
  }
}

export async function saveDb(db: any) {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to save DB:", error);
    throw error;
  }
}
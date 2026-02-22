import fs from "fs/promises";
import path from "path";

const DB_PATH = path.join(process.cwd(), "lib/db.json");


let memoryDb: any = null;

export async function getDb() {
  try {
   
    if (memoryDb) return memoryDb;

    const data = await fs.readFile(DB_PATH, "utf-8");
    memoryDb = JSON.parse(data);

    return memoryDb;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      memoryDb = {};
      return memoryDb;
    }

    console.error("Failed to read DB:", error);
    return memoryDb || {};
  }
}

export async function saveDb(db: any) {
  try {
    memoryDb = db; 

    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });

   
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
  } catch (error) {
 
    console.warn("Running in serverless mode — using memory DB");
  }
}
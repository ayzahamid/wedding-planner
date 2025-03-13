import { db } from "..";
import { guests } from "../schema";
import { ilike, eq } from "drizzle-orm";

export async function getGuestsByName(name: string) {
  try {
    return await db
      .select()
      .from(guests)
      .where(ilike(guests.name, `%${name}%`));
  } catch (error) {
    console.error("Error fetching guests by name:", error);
    throw new Error("Failed to fetch guests");
  }
}

export async function getGuestsByTableId(tableId: number) {
  return db
    .select()
    .from(guests)
    .where(eq(guests.table_id, tableId));
}

export async function checkInGuest(guestId: number) {
  return db
    .update(guests)
    .set({ checked_at: new Date() })
    .where(eq(guests.id, guestId));
}

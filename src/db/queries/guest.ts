import { db } from "..";
import { guests, tables } from "../schema";
import { eq, ilike } from "drizzle-orm";

// Add a guest
export async function addGuest(guest: {
  table_id: number;
  name: string;
  member_count: number;
  phone_number: string;
}) {
  return db.insert(guests).values(guest).returning();
}

// Search guests by complete first or last name
export async function searchGuestsByName(name: string) {
  try {
    return await db
      .select({
        id: guests.id,
        name: guests.name,
        member_count: guests.member_count,
        table_id: guests.table_id,
        created_at: guests.created_at,
        updated_at: guests.updated_at,
        table_no: tables.table_no, // Only selecting table_no from tables
      })
      .from(guests)
      .leftJoin(tables, eq(guests.table_id, tables.id))
      .where(ilike(guests.name, `%${name}%`));
  } catch (error) {
    console.error("Error fetching guests by name:", error);
    throw new Error("Failed to fetch guests");
  }
}

import { db } from "..";
import { guests } from "../schema";
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
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

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

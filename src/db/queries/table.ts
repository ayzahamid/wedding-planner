import { db } from "..";
import { events, tables } from "../schema";
import { eq, and, gte, gt } from "drizzle-orm";

// Get all tables with available seats
export async function getTablesWithAvailableSeats(eventId: string) {
  return db
    .select({
      table: tables,
    })
    .from(tables)
    .leftJoin(events, eq(tables.event_id, events.id))
    .where(and(eq(tables.event_id, eventId)));
}

// Get a table by ID
export async function getTableByTableNo(tableNo: string) {
  const result = await db
    .select()
    .from(tables)
    .where(eq(tables.table_no, tableNo))
    .execute();

  return result[0];
}

//Get table by Id

export async function getTableById(tableId: number) {
  const result = await db
    .select()
    .from(tables)
    .where(eq(tables.id, tableId))
    .execute();

  return result[0];
}


// Update table seats
export async function updateTableSeats(tableId: number, seatsAvailable: number, seatsAssigned: number) {
  return db
    .update(tables)
    .set({ seat_available: seatsAvailable, seat_assigned: seatsAssigned })
    .where(eq(tables.id, tableId));
}

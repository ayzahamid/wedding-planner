import { db } from "..";
import { events, tables } from "../schema";
import { eq, and, gt } from "drizzle-orm";

// Get all tables with available seats
export async function getTablesWithAvailableSeats(eventId: string) {
  return db
    .select({
      table: tables,
      event: events,
    })
    .from(tables)
    .leftJoin(events, eq(tables.event_id, events.id))
    .where(and(eq(tables.event_id, eventId), gt(tables.seat_available, 0)));
}

// Get a table by ID
export async function getTableById(tableId: number) {
  return db.select().from(tables).where(eq(tables.id, tableId)).get();
}

// Update table seats
export async function updateTableSeats(tableId: number, seatsAvailable: number, seatsAssigned: number) {
  return db
    .update(tables)
    .set({ seat_available: seatsAvailable, seat_assigned: seatsAssigned })
    .where(eq(tables.id, tableId));
}

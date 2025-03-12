
import { eq } from "drizzle-orm";
import { db } from ".";
import { events } from "./schema";

export async function getAllEvents() {
  const eventList = await db.select().from(events);
  return Promise.all(eventList.map(async (event) => {
    // const eventTables = await getTablesByEventId(event.id);
    return { ...event };
  }));
}

// export async function getTablesByEventId(eventId: string) {
//   const eventTables = await db.select().from(tables).where(eq(tables.event_id, eventId));
//   return Promise.all(eventTables.map(async (table) => {
//     const tableFamilies = await getFamiliesByTableId(table.id);
//     return { ...table, families: tableFamilies };
//   }));
// }

// // export async function getFamiliesByTableId(tableId: unknown) {
// //   return db.select().from(families).where(eq(families.table_id, tableId));
// // }

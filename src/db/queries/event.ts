import { eq } from "drizzle-orm";
import { db } from "..";
import { events } from "../schema";

export async function getAllEvents() {
  const eventList = await db.select().from(events);
  return Promise.all(
    eventList.map(async (event) => {
      return { ...event };
    })
  );
}

export async function getEventByEventId(eventId: string) {
  const eventList = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId));
  return Promise.all(
    eventList.map(async (event) => {
      return { ...event };
    })
  );
}

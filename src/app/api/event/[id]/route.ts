
import { getEventByEventId } from "@/db/queries/event";
import { getTablesWithAvailableSeats } from "@/db/queries/table";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: eventId } = params;

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  try {
    const event: any = await getEventByEventId(eventId)
    const tables = await getTablesWithAvailableSeats(eventId);

    let newData: any = {
      event: event,
      tables: tables.map(item => item.table)
    }

    return NextResponse.json([newData]);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}

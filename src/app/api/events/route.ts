import { getAllEvents } from "@/db/queries/event";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const enrichedEvents = await getAllEvents();
    return NextResponse.json(enrichedEvents, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

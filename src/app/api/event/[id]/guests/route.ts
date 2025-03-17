import { searchGuestsByName } from "@/db/queries/guest";
import { type NextRequest, NextResponse } from "next/server"

// app/api/guests/route.ts

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchGuestsByName(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error searching guests:", error);
    return NextResponse.json({ error: "Failed to search guests" }, { status: 500 });
  }
}

import { addGuest } from "@/db/queries/guest";
import { getTableByTableNo, updateTableSeats } from "@/db/queries/table";
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table_id, name, member_count, phone_number } = body;

    // Validate required fields
    if (!table_id || !name || !member_count || !phone_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get the table
    const table = await getTableByTableNo(table_id);
    if (!table) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    // Update table seats
    const updatedSeatsAvailable = Math.max(0, table.seat_available - member_count);
    const updatedSeatsAssigned = table.seat_assigned + member_count;

    await updateTableSeats(table.id, updatedSeatsAvailable, updatedSeatsAssigned);

    // Add guest
    const newGuest = await addGuest({
      table_id: table.id,
      name,
      member_count,
      phone_number,
    });

    return NextResponse.json(newGuest);
  } catch (error) {
    console.error("Error registering guest:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

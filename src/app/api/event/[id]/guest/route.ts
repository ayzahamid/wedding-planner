import { addGuest } from "@/db/queries/guest";
import { getTableById, updateTableSeats } from "@/db/queries/table";
import { type NextRequest, NextResponse } from "next/server"

// Mock data for demo purposes - this would be a database in a real app
const mockTables = [
  { table_no: "1", seat_availabe: 2, seat_assigned: 8, position_x: 0.2, position_y: 0.3 },
  { table_no: "2", seat_availabe: 4, seat_assigned: 6, position_x: 0.5, position_y: 0.3 },
  { table_no: "3", seat_availabe: 0, seat_assigned: 10, position_x: 0.8, position_y: 0.3 },
  { table_no: "4", seat_availabe: 5, seat_assigned: 5, position_x: 0.2, position_y: 0.7 },
  { table_no: "5", seat_availabe: 3, seat_assigned: 7, position_x: 0.5, position_y: 0.7 },
  { table_no: "6", seat_availabe: 1, seat_assigned: 9, position_x: 0.8, position_y: 0.7 },
]

const mockFamilies = [
  // Existing families would be here
]

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Body", body)
    const { table_id, name, member_count, phone_number } = body;

    // Validate required fields
    if (!table_id || !name || !member_count || !phone_number) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get the table
    const table = await getTableById(table_id);
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

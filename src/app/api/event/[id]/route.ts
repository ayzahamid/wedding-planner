// import { type NextRequest, NextResponse } from "next/server"

// // Mock data for demo purposes
// const mockEvent = {
//   bride: "Sarah",
//   groom: "Michael",
//   wedding_date: "2025-06-15T18:00:00Z",
//   hall_layout_image: "/wedding-hall-layout.png", // This won't be used anymore as we're using our SVG component
//   tables: [
//     { table_no: "1", seat_availabe: 2, seat_assigned: 8, position_x: 0.15, position_y: 0.3 },
//     { table_no: "2", seat_availabe: 4, seat_assigned: 6, position_x: 0.15, position_y: 0.5 },
//     { table_no: "3", seat_availabe: 0, seat_assigned: 10, position_x: 0.15, position_y: 0.7 },
//     { table_no: "4", seat_availabe: 5, seat_assigned: 5, position_x: 0.25, position_y: 0.3 },
//     { table_no: "5", seat_availabe: 3, seat_assigned: 7, position_x: 0.25, position_y: 0.5 },
//     { table_no: "6", seat_availabe: 1, seat_assigned: 9, position_x: 0.25, position_y: 0.7 },
//     { table_no: "7", seat_availabe: 2, seat_assigned: 8, position_x: 0.75, position_y: 0.3 },
//     { table_no: "8", seat_availabe: 0, seat_assigned: 10, position_x: 0.75, position_y: 0.5 },
//     { table_no: "9", seat_availabe: 3, seat_assigned: 7, position_x: 0.75, position_y: 0.7 },
//     { table_no: "10", seat_availabe: 4, seat_assigned: 6, position_x: 0.85, position_y: 0.3 },
//     { table_no: "11", seat_availabe: 2, seat_assigned: 8, position_x: 0.85, position_y: 0.5 },
//     { table_no: "12", seat_availabe: 1, seat_assigned: 9, position_x: 0.85, position_y: 0.7 },
//     { table_no: "13", seat_availabe: 0, seat_assigned: 10, position_x: 0.4, position_y: 0.83 },
//     { table_no: "14", seat_availabe: 3, seat_assigned: 7, position_x: 0.6, position_y: 0.83 },
//     { table_no: "15", seat_availabe: 2, seat_assigned: 8, position_x: 0.4, position_y: 0.3 },
//     { table_no: "16", seat_availabe: 5, seat_assigned: 5, position_x: 0.6, position_y: 0.3 },
//   ],
// }

// export async function GET({ params }: { params: { id: string } }) {
//   // In a real app, you would fetch the event data from a database
//   // For demo purposes, we'll return mock data

//   return NextResponse.json(mockEvent)
// }


import { getTablesWithAvailableSeats } from "@/db/queries/table";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id: eventId } = params;

  console.log("Params", params)

  if (!eventId) {
    return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
  }

  try {
    const tables = await getTablesWithAvailableSeats(eventId);
    return NextResponse.json(tables);
  } catch (error) {
    console.error("Error fetching tables:", error);
    return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 });
  }
}

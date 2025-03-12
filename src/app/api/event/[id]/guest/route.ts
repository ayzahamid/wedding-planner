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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { table_no, name, phone_number, member_count } = body

    // Validate required fields
    if (!table_no || !name || !phone_number || !member_count) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the table
    const tableIndex = mockTables.findIndex((t) => t.table_no === table_no)
    if (tableIndex === -1) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    // Update table capacity
    // Note: As per requirements, we allow registration even if member_count > seat_availabe
    const table = mockTables[tableIndex]
    const updatedTable = {
      ...table,
      seat_availabe: Math.max(0, table.seat_availabe - member_count),
      seat_assigned: table.seat_assigned + member_count,
    }

    mockTables[tableIndex] = updatedTable

    // Add family to the guest list
    mockFamilies.push({
      table_id: table_no,
      name,
      member_count,
      phone_number,
      checked_at: new Date().toISOString(),
    })

    // Return updated tables
    return NextResponse.json(mockTables)
  } catch (error) {
    console.error("Error processing registration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


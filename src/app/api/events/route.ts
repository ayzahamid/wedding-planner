import { NextResponse } from "next/server"

// Mock data for multiple events
const mockEvents = [
  {
    id: "wedding-sarah-michael",
    type: "wedding",
    title: "Sarah & Michael's Wedding",
    bride: "Sarah",
    groom: "Michael",
    date: "2025-06-15T18:00:00Z",
    venue: "Grand Ballroom",
    address: "123 Celebration Ave, Wedding City",
    guests_count: 150,
    tables_count: 16,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop",
    color_theme: "pink",
  },
  // {
  //   id: "wedding-emma-james",
  //   type: "wedding",
  //   title: "Emma & James's Wedding",
  //   bride: "Emma",
  //   groom: "James",
  //   date: "2025-07-22T17:30:00Z",
  //   venue: "Seaside Resort",
  //   address: "456 Ocean Drive, Beach Haven",
  //   guests_count: 120,
  //   tables_count: 14,
  //   image: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?q=80&w=1000&auto=format&fit=crop",
  //   color_theme: "blue",
  // },
]

export async function GET() {
  // In a real app, you would fetch events from a database
  return NextResponse.json(mockEvents)
}

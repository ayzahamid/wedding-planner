import { type NextRequest, NextResponse } from "next/server"

// Mock data for demo purposes
const mockGuests = [
  {
    table_no: "1",
    name: "Smith Family",
    member_count: 4,
    avatar_url: "https://source.boringavatars.com/beam/120/Smith%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "1",
    name: "Johnson Family",
    member_count: 4,
    avatar_url: "https://source.boringavatars.com/beam/120/Johnson%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "2",
    name: "Williams Family",
    member_count: 3,
    avatar_url: "https://source.boringavatars.com/beam/120/Williams%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "2",
    name: "Brown Family",
    member_count: 3,
    avatar_url: "https://source.boringavatars.com/beam/120/Brown%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "3",
    name: "Jones Family",
    member_count: 5,
    avatar_url: "https://source.boringavatars.com/beam/120/Jones%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "3",
    name: "Miller Family",
    member_count: 5,
    avatar_url: "https://source.boringavatars.com/beam/120/Miller%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "4",
    name: "Davis Family",
    member_count: 2,
    avatar_url: "https://source.boringavatars.com/beam/120/Davis%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "4",
    name: "Garcia Family",
    member_count: 3,
    avatar_url: "https://source.boringavatars.com/beam/120/Garcia%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "5",
    name: "Rodriguez Family",
    member_count: 4,
    avatar_url:
      "https://source.boringavatars.com/beam/120/Rodriguez%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "5",
    name: "Wilson Family",
    member_count: 3,
    avatar_url: "https://source.boringavatars.com/beam/120/Wilson%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "6",
    name: "Martinez Family",
    member_count: 5,
    avatar_url: "https://source.boringavatars.com/beam/120/Martinez%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "6",
    name: "Anderson Family",
    member_count: 4,
    avatar_url: "https://source.boringavatars.com/beam/120/Anderson%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "7",
    name: "Taylor Family",
    member_count: 3,
    avatar_url: "https://source.boringavatars.com/beam/120/Taylor%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "8",
    name: "Thomas Family",
    member_count: 5,
    avatar_url: "https://source.boringavatars.com/beam/120/Thomas%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "9",
    name: "Hernandez Family",
    member_count: 4,
    avatar_url:
      "https://source.boringavatars.com/beam/120/Hernandez%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "10",
    name: "Moore Family",
    member_count: 3,
    avatar_url: "https://source.boringavatars.com/beam/120/Moore%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "11",
    name: "Martin Family",
    member_count: 4,
    avatar_url: "https://source.boringavatars.com/beam/120/Martin%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "12",
    name: "Jackson Family",
    member_count: 5,
    avatar_url: "https://source.boringavatars.com/beam/120/Jackson%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "13",
    name: "Thompson Family",
    member_count: 4,
    avatar_url: "https://source.boringavatars.com/beam/120/Thompson%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "14",
    name: "White Family",
    member_count: 3,
    avatar_url: "https://source.boringavatars.com/beam/120/White%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "15",
    name: "Lopez Family",
    member_count: 5,
    avatar_url: "https://source.boringavatars.com/beam/120/Lopez%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
  {
    table_no: "16",
    name: "Lee Family",
    member_count: 2,
    avatar_url: "https://source.boringavatars.com/beam/120/Lee%20Family?colors=F9A8D4,F472B6,EC4899,DB2777,BE185D",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json([])
  }

  // In a real app, you would query a database
  // For demo purposes, we'll filter the mock data
  // Only return exact word matches as per requirements
  const results = mockGuests.filter((guest) => {
    const nameParts = guest.name.toLowerCase().split(" ")
    return nameParts.some((part) => part === query.toLowerCase())
  })

  return NextResponse.json(results)
}


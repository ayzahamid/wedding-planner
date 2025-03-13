import { db } from ".";
import { guests } from "./schema";

const mockGuests = [
  {
    table_id: 1,
    name: "Smith Family",
    member_count: 4,
    phone_number: "+1234567890",
  },
  {
    table_id: 1,
    name: "Johnson Family",
    member_count: 4,
    phone_number: "+1234567891",
  },
  // Add the rest of your mock data here
];

async function seed() {
  console.log("Seeding guests...");
  await db.insert(guests).values(mockGuests);
  console.log("Seeding completed!");
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});

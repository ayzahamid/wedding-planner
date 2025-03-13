import { date, integer, pgTable, serial, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';


export const postsTable = pgTable('posts_table', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});

// Events Table
export const events = pgTable("events", {
    id: uuid("id").defaultRandom().primaryKey(),
    bride: text("bride").notNull(),
    groom: text("groom").notNull(),
    wedding_date: date("wedding_date").notNull(),
    hall_layout_image: text("hall_layout_image"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
});

// // Tables Table
// export const tables = pgTable("tables", {
//     id: uuid("id").defaultRandom().primaryKey(),
//     event_id: uuid("event_id").references(() => events.id, { onDelete: "cascade" }),
//     table_no: text("table_no").notNull(),
//     seat_available: integer("seat_available").notNull(),
//     seat_assigned: integer("seat_assigned").notNull(),
//     position_x: float("position_x").notNull(),
//     position_y: float("position_y").notNull(),
//     created_at: timestamp("created_at").defaultNow(),
//     updated_at: timestamp("updated_at").defaultNow(),
// });

// // Families Table
export const guests = pgTable("guests", {
  id: serial("id").primaryKey(),
  table_id: integer("table_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  member_count: integer("member_count").notNull(),
  phone_number: varchar("phone_number", { length: 15 }).notNull(),
  checked_at: timestamp("checked_at"),
});


export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;

export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;

// export type InsertGuest = typeof guests.$inferInsert;
// export type SelectGuest = typeof guests.$inferSelect;

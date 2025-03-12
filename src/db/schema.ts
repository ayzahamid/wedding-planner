import { float } from 'drizzle-orm/mysql-core';
import { date, integer, pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';


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
// export const families = pgTable("families", {
//     id: uuid("id").defaultRandom().primaryKey(),
//     table_id: uuid("table_id").references(() => tables.id, { onDelete: "cascade" }),
//     name: text("name").notNull(),
//     member_count: integer("member_count").notNull(),
//     phone_number: text("phone_number").notNull(),
//     checked_at: date("checked_at"),
//     created_at: timestamp("created_at").defaultNow(),
//     updated_at: timestamp("updated_at").defaultNow(),
// });

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;

export type InsertEvent = typeof events.$inferInsert;
export type SelectEvent = typeof events.$inferSelect;

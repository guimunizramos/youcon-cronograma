import { pgTable, uuid, text, integer, boolean, date } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  label: text("label").notNull(),
  color: text("color").notNull(),
  order: integer("order").notNull(),
});

export const items = pgTable("items", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: date("date").notNull(),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  title: text("title").notNull(),
  notes: text("notes"),
  isHighlight: boolean("is_highlight").notNull().default(false),
  order: integer("order").default(0),
});

export type Category = typeof categories.$inferSelect;
export type Item = typeof items.$inferSelect;
export type ItemWithCategory = Item & { category: Category };

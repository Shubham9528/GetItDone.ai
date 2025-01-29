// import { timestamp } from "drizzle-orm/mysql-core";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const todosTable = pgTable("todos", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  todo:text().notNull(),
  readedAt:timestamp('created_at').defaultNow(),
  updatedAt:timestamp('updated_at').$onUpdate(()=>new Date())

});

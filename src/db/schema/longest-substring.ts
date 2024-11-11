import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import user from "./user";

export const longestSubstring = pgTable("longest_substring", {
  id: uuid("id").primaryKey().defaultRandom(),
  query: text("query").notNull(),
  result: text("result").notNull(),
  data: text("data").array().notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const longestSubstringRelation = relations(
  longestSubstring,
  ({ one }) => ({
    user: one(user, {
      fields: [longestSubstring.userId],
      references: [user.id],
    }),
  })
);

export const longestSubstringInsertSchema = createInsertSchema(
  longestSubstring,
  {
    data: z.array(z.string()),
  }
).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type LongestSubstringInsertSchema = z.infer<
  typeof longestSubstringInsertSchema
>;

export const longestSubstringQuerySchema = z.object({
  query: longestSubstringInsertSchema.shape.query
    .trim()
    .min(1, {
      message: "empty not allowed",
    })
    .regex(/^[a-zA-Z]+$/, {
      message: "Only alphabets allowed",
    })
    .max(20, {
      message: "more than 20 characters not allowed",
    }),
});
export type LongestSubstringQuerySchema = z.infer<
  typeof longestSubstringQuerySchema
>;

export const longestSubstringSelectSchema = createSelectSchema(
  longestSubstring,
  {
    data: z.array(z.string()),
  }
);
export type LongestSubstringSelectSchema = z.infer<
  typeof longestSubstringSelectSchema
>;

export default longestSubstring;

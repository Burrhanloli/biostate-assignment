import { relations } from "drizzle-orm";
import { json, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import user from "./user";

export const binaryTreePath = pgTable("binary_tree_path", {
  id: uuid("id").primaryKey().defaultRandom(),
  maxLeafToNode: json("max_leaf_to_node").notNull(),
  maxNodeToNode: json("max_node_to_node").notNull(),
  data: json("data").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const binaryTreePathRelation = relations(binaryTreePath, ({ one }) => ({
  user: one(user, {
    fields: [binaryTreePath.userId],
    references: [user.id],
  }),
}));

export const binaryTreePathInsertSchema = createInsertSchema(binaryTreePath, {
  data: z.object({
    nodes: z.array(z.object({})),
    edges: z.array(z.object({})),
  }),
  maxLeafToNode: z.object({
    sum: z.number(),
    path: z.array(z.string()),
  }),
  maxNodeToNode: z.object({
    sum: z.number(),
    path: z.array(z.string()),
  }),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type BinaryTreePathInsertSchema = z.infer<
  typeof binaryTreePathInsertSchema
>;

export const binaryTreePathSelectSchema = createSelectSchema(binaryTreePath, {
  data: z.object({
    nodes: z.array(z.object({})),
    edges: z.array(z.object({})),
  }),
  maxLeafToNode: z.object({
    sum: z.number(),
    path: z.array(z.string()),
  }),
  maxNodeToNode: z.object({
    sum: z.number(),
    path: z.array(z.string()),
  }),
});
export type BinaryTreePathSelectSchema = z.infer<
  typeof binaryTreePathSelectSchema
>;

export default binaryTreePath;

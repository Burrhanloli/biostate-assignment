import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export enum Role {
  WRITE = "write",
  ADMIN = "admin",
}

export const roleEnum = pgEnum("role", [Role.WRITE, Role.ADMIN]);

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  password: varchar("password", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
  role: roleEnum("role").notNull().default(Role.WRITE),
});

export const userInsertSchema = createInsertSchema(user).omit({
  role: true,
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type UserInsertSchema = z.infer<typeof userInsertSchema>;

export const userLoginSchema = z.object({
  email: userInsertSchema.shape.email.trim().email({
    message: "Required",
  }),
  password: userInsertSchema.shape.password.trim().min(1, {
    message: "Required",
  }),
});
export type UserLoginSchema = z.infer<typeof userLoginSchema>;

export const userSelectSchema = createSelectSchema(user);
export type UserSelectSchema = z.infer<typeof userSelectSchema>;

export default user;

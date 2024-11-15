import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/lib/env";

import * as schema from "./schema/index";

export const client = postgres(env.DB_URL, {
  max: env.DB_MIGRATING ? 1 : undefined,
  prepare: false,
});
const db = drizzle(client, {
  schema,
});
export default db;
export type DB = typeof db;

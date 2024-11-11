import { Table, sql } from "drizzle-orm";

import db, { DB } from "@/db";
import * as schema from "@/db/schema";
import * as seeds from "@/db/seed/index";

async function resetTable(db: DB, table: Table) {
  return db.execute(sql`truncate table ${table} restart identity cascade`);
}

async function main() {
  for (const table of [schema.user]) {
    await resetTable(db, table);
  }
  await seeds.user(db);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding done!");
    process.exit(0);
  });

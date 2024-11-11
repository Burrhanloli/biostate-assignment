import { DB } from "@/db";
import { user } from "@/db/schema";
import { hashPassword } from "@/lib/auth";

import { UserInsertSchema } from "../schema/user";

const mock = async () => {
  const data: UserInsertSchema[] = [];

  data.push({
    password: await hashPassword("biostate"),
    email: "biostate.assignment@gmail.com",
  });

  return data;
};

export async function seed(db: DB) {
  await db.insert(user).values(await mock());
}

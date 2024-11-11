"use server";

import { redirect } from "next/navigation";

import "server-only";

import db from "@/db";
import user, { UserInsertSchema, userInsertSchema } from "@/db/schema/user";
import { executeAction } from "@/db/utils/execute-action";
import { hashPassword } from "@/lib/auth";

export async function register(data: UserInsertSchema) {
  return executeAction({
    actionFn: async () => {
      const validatedData = userInsertSchema.parse(data);
      await db.insert(user).values({
        ...validatedData,
        password: await hashPassword(validatedData.password),
      });
      redirect("/login");
    },
    isProtected: false,
    clientSuccessMessage: "registered successfully",
    serverErrorMessage: "register",
  });
}

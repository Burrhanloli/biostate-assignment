"use server";

import "server-only";

import { UserLoginSchema, userLoginSchema } from "@/db/schema/user";
import { executeAction } from "@/db/utils/execute-action";
import { signIn as authSignIn } from "@/lib/auth";

export async function signIn(data: UserLoginSchema) {
  return executeAction({
    actionFn: async () => {
      const validatedData = userLoginSchema.parse(data);
      await authSignIn("credentials", {
        ...validatedData,
        redirectTo: "/dashboard",
      });
    },
    isProtected: false,
    clientSuccessMessage: "Signed in successfully",
    serverErrorMessage: "signIn",
  });
}

import { isRedirectError } from "next/dist/client/components/redirect";

import { Session } from "next-auth";

import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/utils/toast";

type Options<T> = {
  actionFn: {
    (session?: Session): Promise<T>;
  };
  isProtected?: boolean;
  serverErrorMessage?: string;
  clientSuccessMessage?: string;
};

export async function executeAction<T>({
  actionFn,
  isProtected = true,
  serverErrorMessage = "Error executing action",
  clientSuccessMessage = "Operation was successful",
}: Options<T>): Promise<{ success: boolean; message: string }> {
  try {
    if (isProtected) {
      const session = await auth();
      if (!session) throw new Error("Not authorized");
    }

    await actionFn();

    return {
      success: true,
      message: clientSuccessMessage,
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.error(serverErrorMessage, error);
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
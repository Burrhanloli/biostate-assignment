import { AuthError } from "next-auth";
import { ZodError } from "zod";

import { toast as rawToast } from "@/hooks/use-toast";

export function getErrorMessage(error: unknown): string {
  let message: string;

  if (error instanceof ZodError) {
    message = error.errors[0].message;
  } else if (error instanceof AuthError) {
    message = error.cause?.err?.message || "Unknown authorization error";
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === "object" && "message" in error) {
    message = String(error.message);
  } else if (typeof error === "string") {
    message = error;
  } else {
    message = "Unknown error";
  }

  return message;
}

export function toast(response: unknown) {
  if (
    typeof response === "object" &&
    response !== null &&
    response !== undefined
  ) {
    const res = response as { message?: unknown; success?: unknown };

    if (typeof res.message === "string" && typeof res.success === "boolean") {
      rawToast({
        title: res.message,
        variant: res.success === true ? "default" : "destructive",
      });
      return;
    }
  }
  if (!!response) {
    rawToast({
      title: "Invalid response",
      variant: "destructive",
    });
  }
}

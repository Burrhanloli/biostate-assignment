"use server";

import "server-only";

import db from "@/db";
import { executeQuery } from "@/db/utils/execute-query";

export async function fetchResult(id: string) {
  return executeQuery({
    queryFn: async () => {
      return await db.query.longestSubstring.findFirst({
        where: (history, { eq }) => eq(history.id, id),
        with: {
          user: true,
        },
      });
    },
    isProtected: true,
    serverErrorMessage: "fetchHistory",
  });
}

"use server";

import "server-only";

import db from "@/db";
import { BinaryTreePathSelectSchema } from "@/db/schema/binary-tree-path";
import { executeQuery } from "@/db/utils/execute-query";

export async function fetchResult(id: string) {
  return executeQuery({
    queryFn: async () => {
      return (await db.query.binaryTreePath.findFirst({
        where: (history, { eq }) => eq(history.id, id),
        with: {
          user: true,
        },
      })) as BinaryTreePathSelectSchema;
    },
    isProtected: true,
    serverErrorMessage: "fetchHistory",
  });
}

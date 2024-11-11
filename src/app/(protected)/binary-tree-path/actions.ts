"use server";

import "server-only";

import db from "@/db";
import { binaryTreePath } from "@/db/schema";
import { BinaryTreePathInsertSchema } from "@/db/schema/binary-tree-path";
import { executeAction } from "@/db/utils/execute-action";
import { executeQuery } from "@/db/utils/execute-query";

export async function saveResult(data: BinaryTreePathInsertSchema) {
  return executeAction({
    actionFn: async () => {
      await db.insert(binaryTreePath).values({
        ...data,
      });
    },
    isProtected: true,
    clientSuccessMessage: "Saved result successfully",
    serverErrorMessage: "saveResult",
  });
}

export async function fetchHistory() {
  return executeQuery({
    queryFn: async () => {
      return await db.query.binaryTreePath.findMany({
        orderBy: (posts, { desc }) => [desc(posts.createdAt)],
        with: {
          user: true,
        },
      });
    },
    isProtected: true,
    serverErrorMessage: "fetchHistory",
  });
}

"use server";

import "server-only";

import db from "@/db";
import longestSubstring, {
  LongestSubstringInsertSchema,
  LongestSubstringQuerySchema,
  longestSubstringQuerySchema,
} from "@/db/schema/longest-substring";
import { executeAction } from "@/db/utils/execute-action";
import { executeQuery } from "@/db/utils/execute-query";

function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export async function getLongestSubString(data: LongestSubstringQuerySchema) {
  return executeQuery({
    queryFn: async () => {
      const validatedData = await longestSubstringQuerySchema.parseAsync(data);
      const [result, value] = await Promise.all([
        lengthOfLongestSubstring(validatedData.query),
        findUniqueSubstrings(validatedData.query),
      ]);

      return {
        query: validatedData.query,
        result: result,
        data: removeItem(value, result),
      };
    },
    isProtected: true,
    serverErrorMessage:
      "error occurred while calculating the longest substring",
  });
}

export const findUniqueSubstrings = async (query: string) => {
  const result = new Set<string>();

  for (let i = 0; i < query.length; i++) {
    const charSet = new Set<string>();
    for (let j = i; j < query.length; j++) {
      const char = query[j];
      if (charSet.has(char)) {
        break;
      }
      charSet.add(char);
      result.add(query.substring(i, j + 1));
    }
  }

  return Array.from<string>(result)
    .filter((value) => value.length < 10)
    .sort((a, b) => a.length - b.length);
};

export const lengthOfLongestSubstring = async (query: string) => {
  let startOfWindow = 0,
    maxLength = 0,
    maxSubstring = "";

  const charMap = new Map();

  for (let i = 0; i < query.length; i++) {
    const char = query[i];
    const lastIndex = charMap.get(char);

    if (lastIndex >= startOfWindow) {
      startOfWindow = lastIndex + 1;
    }

    charMap.set(char, i);

    const currentLength = i - startOfWindow + 1;
    if (currentLength > maxLength) {
      maxLength = currentLength;
      maxSubstring = query.substring(startOfWindow, i + 1);
    }
  }

  return maxSubstring;
};

export async function saveResult(data: LongestSubstringInsertSchema) {
  return executeAction({
    actionFn: async () => {
      await db.insert(longestSubstring).values({
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
      return await db.query.longestSubstring.findMany({
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

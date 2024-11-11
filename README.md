# Biostate Assginment

## Stack

- Linting / Code Style
  - [eslint](https://www.npmjs.com/package/eslint)
    - [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier)
      - [ESLint | Next.js](https://nextjs.org/docs/app/building-your-application/configuring/eslint#prettier)
    - [eslint-plugin-check-file](https://www.nvpmjs.com/package/eslint-plugin-check-file)
      - [Bulletproof React Guide](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-standards.md#file-naming-conventions)
    - [eslint-plugin-n](https://www.npmjs.com/package/eslint-plugin-n)
  - [prettier](https://www.npmjs.com/package/prettier)
    - [@trivago/prettier-plugin-sort-imports](https://www.npmjs.com/package/@trivago/prettier-plugin-sort-imports)
    - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
      - [Automatic Class Sorting](https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted)
- Environment Variables
  - [dotenv](https://www.npmjs.com/package/dotenv)
  - [dotenv-expand](https://www.npmjs.com/package/dotenv-expand)
  - [@t3-oss/env-nextjs](https://www.npmjs.com/package/@t3-oss/env-nextjs)
    - [Documentation](https://env.t3.gg/docs/nextjs)
- Styles / UI
  - [tailwindcss](https://www.npmjs.com/package/tailwindcss)
  - [@shadcn/ui](https://ui.shadcn.com/)
  - [next-themes](https://www.npmjs.com/package/next-themes)
- Validation
  - [zod](https://www.npmjs.com/package/zod)
  - [drizzle-zod](https://www.npmjs.com/package/drizzle-zod)
    - [Drizzle Zod Docs](https://orm.drizzle.team/docs/zod)
- Database
  - [drizzle-orm](https://www.npmjs.com/package/drizzle-orm)
  - [postgres](https://www.npmjs.com/package/postgres)
  - [supabase - PROD](https://supabase.com/)
  - [drizzle-kit](https://www.npmjs.com/package/drizzle-kit)
- Authentication
  - [next-auth](https://www.npmjs.com/package/next-auth)

## Setup Local
1. Install dependencies:

```sh
bun install
```

2. Copy the `.env` file:

```sh
cp .env.example .env
```

3. Update the following values in the `.env` file:

```sh
NEXTAUTH_SECRET=your-value-here
```

4. Start the database:

```sh
docker compose up
```

5. Migrate the database:

```sh
bun run db:migrate
```
6. add seeding data:

```sh
bun run db:seed
```

7. Start the app:

```sh
bun run dev
```

8. Open the url:

```sh
http://localhost:3000
```

9. use seeded user to login, or register a new user

```sh
username: biostate.assignment@gmail.com
password: biostate
```

## Alogorithms Used

# Longest Substring Calculation

It takes the moving window concept but utilises Maps for lightning-fast lookups. Interestingly, because a Map is a key-value pair, we’re able to use the letter as the key, and the position that it sits within the string as the value

- Time Complexity: O(n)

Each character in the string is processed exactly once, making the time complexity linear to the length of the string.

- Space Complexity: O(min(m, n))

The space complexity is primarily due to the charMap. In the worst case, the map can store information for all unique characters in the string. However, if the string has many repeated characters, the map's size will be smaller. Therefore, the space complexity is bounded by the minimum of the number of unique characters (m) and the length of the string (n).

# All Substrings values Calculation

The algorithm iterates through the string, building substrings one character at a time. It keeps track of unique characters in a set. If a repeated character is found, the current substring is added to the result set and the process moves to the next starting character. Finally, the substrings are filtered by length and sorted.

- Time Complexity: O(n^2)

The worst-case time complexity of this algorithm is O(n^2), where n is the length of the query string. This occurs when all substrings are unique.

- Space Complexity: O(n)

The space complexity is O(n) due to the result Set and the charSet used for each substring.

# DFS Search

- Recursive Exploration:

The algorithm initiates a recursive exploration of the tree, starting from the root node.
For each node, it iterates over its children.
For each child, it recursively calls itself, passing the child node as the new starting point.

- Maximum Path Calculation:

During the recursive calls, the algorithm calculates the maximum sum path from each leaf node to its parent node.
It compares this sum with the current maximum sum and updates the maximum sum and path accordingly.

- Backtracking and Sum Accumulation:

As the recursion unwinds, the algorithm backtracks to the parent node.
At each parent node, it adds its own value to the maximum sum of its children.
This process continues until the root node is reached, where the final maximum sum path is determined.

- Time Complexity: O(N)

The time complexity is linear to the number of nodes in the tree (N). This is because each node is visited exactly once during the DFS traversal.

- Space Complexity: O(H)

The space complexity is determined by the maximum depth of the recursion stack, which is equivalent to the height (H) of the tree. In the worst case, for a skewed tree, the space complexity can be O(N).

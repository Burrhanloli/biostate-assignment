import { authConfig } from "$/auth.config";
import * as bcrypt from "bcrypt";
import { and, eq } from "drizzle-orm";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import db from "@/db";
import { user } from "@/db/schema";
import { userLoginSchema } from "@/db/schema/user";

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Adjust this value as needed for security vs. performance

  return bcrypt.hash(password, saltRounds);
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: authConfig.session,
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      credentials: {
        userName: {},
        password: {},
      },
      authorize: async (credentials) => {
        const validatedData = userLoginSchema.parse(credentials);

        const dbUser = (
          await db
            .select()
            .from(user)
            .where(and(eq(user.email, validatedData.email)))
        )[0];
        if (!dbUser) {
          throw new Error("User not found");
        }

        const passwordMatch = await bcrypt.compare(
          validatedData.password,
          dbUser!.password
        );

        if (!passwordMatch) {
          throw new Error("Wrong credentials");
        }

        return { ...dbUser, id: dbUser.id.toString() };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error user.role is custom property
        token.role = user.role;

        token.email = user.email;
      }
      return token;
    },
    session({ session, token }) {
      // @ts-expect-error session.user.id is custom property
      session.user.id = token.id;
      // @ts-expect-error session.user.role is custom property
      session.user.role = token.role;
      // @ts-expect-error session.user.email is custom property
      session.user.email = token.email;
      return session;
    },
  },
});

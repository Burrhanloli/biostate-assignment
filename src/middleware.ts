import { NextRequest } from "next/server";

import { authConfig } from "$/auth.config";
import NextAuth from "next-auth";

const { auth } = NextAuth({
  session: authConfig.session,
  providers: [],
});

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;
  const session = await auth();
  const isAuthenticated = !!session?.user;

  const isPublicRoute =
    ["/login", "/register"].find((route) =>
      nextUrl.pathname.startsWith(route)
    ) || nextUrl.pathname === "/";

  if (isAuthenticated && isPublicRoute) {
    return Response.redirect(new URL("/dashboard", nextUrl));
  }

  if (!isAuthenticated && !isPublicRoute)
    return Response.redirect(new URL("/login", nextUrl));
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

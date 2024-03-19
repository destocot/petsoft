import type { NextAuthConfig } from "next-auth";
import { getUserByEmail } from "./server-utils";

export const nextAuthEdgeConfig = {
  pages: { signIn: "/login" },
  callbacks: {
    authorized: ({ auth, request }) => {
      const { nextUrl } = request;
      const { pathname } = nextUrl;
      const { redirect } = Response;

      const isAuthRoute = ["/login", "/signup"].includes(pathname);
      const isPaymentRoute = ["/payment"].includes(pathname);
      const isAppRoute = pathname.startsWith("/app");

      const authenticated = Boolean(auth?.user);
      const hasAccess = auth?.user.hasAccess;

      if (isAppRoute) {
        if (!authenticated) return false;
        if (!hasAccess) return redirect(new URL("/payment", nextUrl));
      }

      if (isPaymentRoute) {
        if (!authenticated) return false;
        if (hasAccess) return redirect(new URL("/app/dashboard", nextUrl));
      }

      if (isAuthRoute) {
        if (hasAccess) return redirect(new URL("/app/dashboard", nextUrl));
        if (authenticated) return redirect(new URL("/payment", nextUrl));
      }

      return true;
    },
    jwt: async ({ token, user, trigger }) => {
      if (user?.id) {
        token.userId = user.id;
        token.email = user.email;
        token.hasAccess = user.hasAccess;
      }
      if (trigger === "update" && token?.email) {
        const userFromDb = await getUserByEmail(token.email);
        if (userFromDb) {
          token.userId = userFromDb.id;
          token.email = userFromDb.email;
          token.hasAccess = userFromDb.hasAccess;
        }
      }

      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
      session.user.hasAccess = token.hasAccess;

      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;

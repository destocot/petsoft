import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "@/lib/validations";

const config = {
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedCredentials = authSchema.safeParse(credentials);
        if (!validatedCredentials.success) return null;

        const { email, password } = validatedCredentials.data;

        const user = await getUserByEmail(email);
        if (!user) return null;

        const match = bcrypt.compare(password, user.hashedPassword);
        if (!match) return null;

        const { hashedPassword, ...rest } = user;
        return rest;
      },
    }),
  ],
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
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);

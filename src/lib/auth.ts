import NextAuth, { NextAuthConfig } from "next-auth";
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
      const needsAuth = nextUrl.pathname.startsWith("/app");
      const authPages = ["/login", "/signup"];

      const authenticated = Boolean(auth?.user);

      if (needsAuth) return authenticated;

      if (authPages.includes(nextUrl.pathname)) {
        return authenticated
          ? Response.redirect(new URL("/app/dashboard", nextUrl))
          : true;
      }

      return true;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.id = token.userId;
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

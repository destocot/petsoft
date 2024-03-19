import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "@/lib/validations";
import { nextAuthEdgeConfig } from "@/lib/auth-edge";

const config = {
  ...nextAuthEdgeConfig,
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
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);

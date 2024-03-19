import { User } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    hasAccess: boolean;
    email: string;
  }

  interface Session {
    user: User & {
      id: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    hasAccess: boolean;
  }
}

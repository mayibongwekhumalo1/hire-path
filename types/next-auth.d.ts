import { UserRole } from "./index";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      department?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    department?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    department?: string;
  }
}
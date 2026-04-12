import { UserRole, OrgType } from "@prisma/client";

declare module "next-auth" {
  interface User {
    role: UserRole;
    organizationId?: string;
    organizationName?: string;
    organizationType?: OrgType;
    isVerified?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: UserRole;
      organizationId?: string;
      organizationName?: string;
      organizationType?: OrgType;
      isVerified?: boolean;
    };
  }
}

declare module "@auth/core/types" {
  interface User {
    role: UserRole;
    organizationId?: string;
    organizationName?: string;
    organizationType?: OrgType;
    isVerified?: boolean;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      image?: string;
      role: UserRole;
      organizationId?: string;
      organizationName?: string;
      organizationType?: OrgType;
      isVerified?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    organizationId?: string;
    organizationName?: string;
    organizationType?: OrgType;
    isVerified?: boolean;
  }
}

export {};

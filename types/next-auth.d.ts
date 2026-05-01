// Local type definitions — no longer depends on @prisma/client
type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN_PLATFORM"
  | "VERIFIKATOR"
  | "AUDITOR"
  | "PERUSAHAAN"
  | "PENGUSUL"
  | "DONOR_KOLABORATOR"
  | "PUBLIC";

type OrgType =
  | "PERUSAHAAN"
  | "NGO"
  | "KOMUNITAS"
  | "SEKOLAH"
  | "KOPERASI"
  | "YAYASAN"
  | "STARTUP_SOSIAL"
  | "PEMERINTAH"
  | "LAINNYA";

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

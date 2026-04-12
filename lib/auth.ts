import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { UserRole } from "@prisma/client";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 }, // 30 days
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/verify-email",
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        totpCode: { label: "Kode 2FA", type: "text" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
          include: {
            organization: {
              include: { organization: true },
              where: { isActive: true },
              take: 1,
            },
          },
        });

        if (!user || !user.password) return null;

        // Check account status
        if (!user.isActive) return null;
        if (user.isSuspended) return null;

        // Check account lockout
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          // Increment login attempts
          const attempts = user.loginAttempts + 1;
          const lockUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: attempts,
              lockedUntil: lockUntil,
            },
          });

          return null;
        }

        // Reset login attempts on success
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        const org = user.organization[0]?.organization;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          organizationId: org?.id,
          organizationName: org?.name,
          organizationType: org?.type,
          isVerified: org?.verificationStatus === "TERVERIFIKASI",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;

        // For OAuth (Google), fetch full user data from DB since
        // PrismaAdapter only returns base fields without role/org
        if (account?.provider === "google") {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
              organization: {
                include: { organization: true },
                where: { isActive: true },
                take: 1,
              },
            },
          });
          if (dbUser) {
            token.role = dbUser.role;
            const org = dbUser.organization[0]?.organization;
            token.organizationId = org?.id;
            token.organizationName = org?.name;
            token.organizationType = org?.type;
            token.isVerified = org?.verificationStatus === "TERVERIFIKASI";
          }
        } else {
          token.role = (user as any).role;
          token.organizationId = (user as any).organizationId;
          token.organizationName = (user as any).organizationName;
          token.organizationType = (user as any).organizationType;
          token.isVerified = (user as any).isVerified;
        }
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.organizationId = token.organizationId as string | undefined;
        session.user.organizationName = token.organizationName as string | undefined;
        session.user.organizationType = token.organizationType as any;
        session.user.isVerified = token.isVerified as boolean | undefined;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      if (user.id) {
        await prisma.loginHistory.create({
          data: {
            userId: user.id,
            success: true,
          },
        });
      }
    },
  },
});

// ============================================================
// PERMISSION HELPERS
// ============================================================

export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: ["*"],
  ADMIN_PLATFORM: [
    "users:read", "users:write", "users:suspend",
    "organizations:read", "organizations:write", "organizations:verify",
    "proposals:read", "proposals:write", "proposals:approve",
    "projects:read", "projects:write",
    "reports:read", "reports:write",
    "settings:read", "settings:write",
    "audit:read",
  ],
  VERIFIKATOR: [
    "organizations:read", "organizations:verify",
    "proposals:read",
    "documents:read", "documents:verify",
  ],
  AUDITOR: [
    "projects:read",
    "reports:read", "reports:write",
    "audit:read", "audit:write",
    "proposals:read",
  ],
  PERUSAHAAN: [
    "proposals:read", "proposals:shortlist", "proposals:approve",
    "projects:read", "projects:write",
    "reports:read",
    "funding:read", "funding:write",
    "cofunding:read", "cofunding:write",
  ],
  PENGUSUL: [
    "proposals:create", "proposals:read", "proposals:update",
    "projects:read", "projects:report",
    "organizations:read", "organizations:update-own",
  ],
  DONOR_KOLABORATOR: [
    "proposals:read",
    "cofunding:read", "cofunding:write",
    "projects:read",
  ],
  PUBLIC: [
    "proposals:read-public",
    "organizations:read-public",
  ],
} as const;

export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[role] as readonly string[];
  return perms.includes("*") || perms.includes(permission);
}

export function canAccess(role: UserRole, resource: string): boolean {
  const prefix = resource.split(":")[0];
  const perms = ROLE_PERMISSIONS[role] as readonly string[];
  return (
    perms.includes("*") ||
    perms.some((p) => p === resource || p.startsWith(`${prefix}:`))
  );
}

// Admin roles that can access admin panel
export const ADMIN_ROLES: UserRole[] = [
  "SUPER_ADMIN",
  "ADMIN_PLATFORM",
  "VERIFIKATOR",
  "AUDITOR",
];

export function isAdminRole(role: UserRole): boolean {
  return ADMIN_ROLES.includes(role);
}

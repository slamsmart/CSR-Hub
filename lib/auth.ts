import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { convexClient } from "@/lib/convex";
import { api } from "@/convex/_generated/api";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
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
      allowDangerousEmailAccountLinking: true,
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

        // Query Convex for the user
        const user = await convexClient.query(api.auth.getUserByEmail, {
          email: email.toLowerCase(),
        });

        if (!user || !user.password) return null;

        // Check account status
        if (!user.isActive) return null;
        if (user.isSuspended) return null;
        if (!user.emailVerified) return null;

        // Check account lockout
        if (user.lockedUntil && user.lockedUntil > Date.now()) {
          return null;
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          // Increment login attempts in Convex
          await convexClient.mutation(api.auth.incrementLoginAttempts, {
            email: email.toLowerCase(),
          });
          return null;
        }

        // Reset login attempts on success
        await convexClient.mutation(api.auth.resetLoginAttempts, {
          email: email.toLowerCase(),
        });

        const org = user.organization;

        return {
          id: user._id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: Boolean(user.emailVerified),
          organizationId: org?.id,
          organizationName: org?.name,
          organizationType: org?.type,
          isVerified: org?.verificationStatus === "TERVERIFIKASI",
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase();
        if (!email) return false;

        try {
          const result = await convexClient.mutation(api.auth.findOrCreateGoogleUser, {
            email,
            name: user.name || email.split("@")[0],
            image: user.image || undefined,
            googleAccountId: account.providerAccountId,
          });

          // Attach Convex data to user object for JWT callback
          user.id = result.id;
          (user as any).role = result.role;
          (user as any).organizationId = result.organization?.id;
          (user as any).organizationName = result.organization?.name;
          (user as any).organizationType = result.organization?.type;
          (user as any).isVerified = result.organization?.verificationStatus === "TERVERIFIKASI";
        } catch (err: any) {
          if (err?.message?.includes("ACCOUNT_BLOCKED")) return false;
          console.error("[Auth] Google sign-in error:", err);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "PUBLIC";
        token.organizationId = (user as any).organizationId;
        token.organizationName = (user as any).organizationName;
        token.organizationType = (user as any).organizationType;
        token.isVerified = (user as any).isVerified;
      }

      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = (token.role as any) || "PUBLIC";
        session.user.organizationId = token.organizationId as string | undefined;
        session.user.organizationName = token.organizationName as string | undefined;
        session.user.organizationType = token.organizationType as any;
        session.user.isVerified = token.isVerified as boolean | undefined;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account }) {
      if (user.email) {
        try {
          await convexClient.mutation(api.auth.recordLoginHistory, {
            email: user.email.toLowerCase(),
            success: true,
          });
        } catch (e) {
          console.error("[Auth] Failed to record login history:", e);
        }
      }
    },
  },
});

// ============================================================
// PERMISSION HELPERS
// ============================================================

import type { UserRole } from "@/types";

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

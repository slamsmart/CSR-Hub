import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ============================================================
// USER REGISTRATION
// ============================================================

export const registerUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(), // already hashed from the API route
    role: v.string(),
    phone: v.optional(v.string()),
    organizationName: v.optional(v.string()),
    organizationType: v.optional(v.string()),
    verifyCode: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Check if email already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("EMAIL_EXISTS");
    }

    // Create user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      password: args.password,
      role: args.role,
      phone: args.phone,
      isActive: true,
      isSuspended: false,
      twoFactorEnabled: false,
      loginAttempts: 0,
      mustChangePassword: false,
      updatedAt: now,
    });

    // Create organization if provided
    let orgId: Id<"organizations"> | undefined;
    if (args.organizationName) {
      const slug =
        args.organizationName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "") +
        "-" +
        now;

      orgId = await ctx.db.insert("organizations", {
        name: args.organizationName,
        slug,
        type: args.organizationType || "LAINNYA",
        verificationStatus: "BELUM_DIAJUKAN",
        email: args.email,
        trustScore: 50,
        isPublic: false,
        isFeatured: false,
        totalProposals: 0,
        approvedProposals: 0,
        totalFundingReceived: 0,
        totalBeneficiaries: 0,
        projectSuccessRate: 0,
        updatedAt: now,
      });

      // Create organization membership
      await ctx.db.insert("organizationMembers", {
        organizationId: orgId,
        userId: userId,
        role: "OWNER",
        isActive: true,
        joinedAt: now,
      });

      // Create respective profile
      if (args.role === "PERUSAHAAN") {
        await ctx.db.insert("companyProfiles", {
          organizationId: orgId,
          fokusCSR: [],
          targetSDGs: [],
          wilayahFokus: [],
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("ngoProfiles", {
          organizationId: orgId,
          kategoriUtama: [],
          targetSDGs: [],
          wilayahKerja: [],
          updatedAt: now,
        });
      }
    }

    // Delete any existing verification tokens for this email
    const existingTokens = await ctx.db
      .query("verificationTokens")
      .withIndex("by_token")
      .take(100);
    for (const token of existingTokens) {
      if (token.identifier === args.email) {
        await ctx.db.delete(token._id);
      }
    }

    // Create verification token
    await ctx.db.insert("verificationTokens", {
      identifier: args.email,
      token: args.verifyCode,
      expires: now + 10 * 60 * 1000, // 10 minutes
    });

    // Create audit log
    await ctx.db.insert("auditLogs", {
      userId: userId,
      action: "CREATE",
      resource: "users",
      resourceId: userId,
    });

    return {
      userId,
      organizationId: orgId,
      email: args.email,
      name: args.name,
    };
  },
});

// ============================================================
// USER LOGIN QUERY
// ============================================================

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) return null;

    // Get organization membership
    const membership = await ctx.db
      .query("organizationMembers")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();

    let organization = null;
    if (membership) {
      organization = await ctx.db.get(membership.organizationId);
    }

    return {
      ...user,
      organization: organization
        ? {
            id: organization._id,
            name: organization.name,
            type: organization.type,
            verificationStatus: organization.verificationStatus,
          }
        : null,
    };
  },
});

// ============================================================
// VERIFY EMAIL
// ============================================================

export const verifyEmail = mutation({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Find the verification token
    const tokens = await ctx.db
      .query("verificationTokens")
      .withIndex("by_token", (q) => q.eq("token", args.code))
      .take(10);

    const token = tokens.find(
      (t) => t.identifier === args.email.toLowerCase()
    );

    if (!token) {
      throw new Error("INVALID_CODE");
    }

    if (token.expires < now) {
      throw new Error("CODE_EXPIRED");
    }

    // Update user email verification
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    await ctx.db.patch(user._id, {
      emailVerified: now,
      updatedAt: now,
    });

    // Delete the used token
    await ctx.db.delete(token._id);

    return { success: true };
  },
});

// ============================================================
// RESEND OTP
// ============================================================

export const createVerificationToken = mutation({
  args: {
    email: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Delete existing tokens for this email
    const existingTokens = await ctx.db
      .query("verificationTokens")
      .withIndex("by_token")
      .take(100);
    for (const token of existingTokens) {
      if (token.identifier === args.email.toLowerCase()) {
        await ctx.db.delete(token._id);
      }
    }

    // Create new token
    await ctx.db.insert("verificationTokens", {
      identifier: args.email.toLowerCase(),
      token: args.code,
      expires: now + 10 * 60 * 1000,
    });

    return { success: true };
  },
});

// ============================================================
// LOGIN HELPERS
// ============================================================

export const incrementLoginAttempts = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) return;

    const attempts = user.loginAttempts + 1;
    const lockUntil = attempts >= 5 ? Date.now() + 15 * 60 * 1000 : undefined;

    await ctx.db.patch(user._id, {
      loginAttempts: attempts,
      lockedUntil: lockUntil,
      updatedAt: Date.now(),
    });
  },
});

export const resetLoginAttempts = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) return;

    await ctx.db.patch(user._id, {
      loginAttempts: 0,
      lockedUntil: undefined,
      lastLoginAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

export const recordLoginHistory = mutation({
  args: {
    email: v.string(),
    success: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!user) return;

    await ctx.db.insert("loginHistory", {
      userId: user._id,
      success: args.success,
      reason: args.reason,
    });
  },
});

export const findOrCreateGoogleUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    image: v.optional(v.string()),
    googleAccountId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const email = args.email.toLowerCase();

    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existing) {
      // Check account status
      if (!existing.isActive || existing.isSuspended) {
        throw new Error("ACCOUNT_BLOCKED");
      }

      // Link Google account if not already linked
      const existingAccount = await ctx.db
        .query("accounts")
        .withIndex("by_provider_and_providerAccountId", (q) =>
          q.eq("provider", "google").eq("providerAccountId", args.googleAccountId)
        )
        .first();

      if (!existingAccount) {
        await ctx.db.insert("accounts", {
          userId: existing._id,
          type: "oauth",
          provider: "google",
          providerAccountId: args.googleAccountId,
        });
      }

      // Mark email as verified if not already
      if (!existing.emailVerified) {
        await ctx.db.patch(existing._id, {
          emailVerified: now,
          updatedAt: now,
        });
      }

      // Get organization
      const membership = await ctx.db
        .query("organizationMembers")
        .withIndex("by_userId", (q) => q.eq("userId", existing._id))
        .first();

      let organization = null;
      if (membership) {
        const org = await ctx.db.get(membership.organizationId);
        if (org) {
          organization = {
            id: org._id,
            name: org.name,
            type: org.type,
            verificationStatus: org.verificationStatus,
          };
        }
      }

      return {
        id: existing._id,
        email: existing.email,
        name: existing.name,
        image: existing.image || args.image,
        role: existing.role,
        organization,
      };
    }

    // Create new user
    const userId = await ctx.db.insert("users", {
      name: args.name,
      email,
      image: args.image,
      role: "PUBLIC",
      isActive: true,
      isSuspended: false,
      twoFactorEnabled: false,
      loginAttempts: 0,
      mustChangePassword: false,
      emailVerified: now,
      updatedAt: now,
    });

    // Link Google account
    await ctx.db.insert("accounts", {
      userId,
      type: "oauth",
      provider: "google",
      providerAccountId: args.googleAccountId,
    });

    return {
      id: userId,
      email,
      name: args.name,
      image: args.image,
      role: "PUBLIC",
      organization: null,
    };
  },
});

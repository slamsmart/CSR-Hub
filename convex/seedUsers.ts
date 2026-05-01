import { internalMutation } from "./_generated/server";

export const seedUsers = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    const superAdmin = await ctx.db.insert("users", {
      name: "Super Admin CSR Hub", email: "superadmin@csrhub.id", password: "hashed_Password123!", role: "SUPER_ADMIN",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const adminPlatform = await ctx.db.insert("users", {
      name: "Dewi Kurniawati", email: "admin@csrhub.id", password: "hashed_Password123!", role: "ADMIN_PLATFORM",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const verifikator = await ctx.db.insert("users", {
      name: "Agus Hermawan", email: "verifikator@csrhub.id", password: "hashed_Password123!", role: "VERIFIKATOR",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const auditor = await ctx.db.insert("users", {
      name: "Dr. Sri Mulyani", email: "auditor@csrhub.id", password: "hashed_Password123!", role: "AUDITOR",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const companyUser1 = await ctx.db.insert("users", {
      name: "Budi Santoso", email: "csr@pertamina-csr.id", password: "hashed_Password123!", role: "PERUSAHAAN",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const companyUser2 = await ctx.db.insert("users", {
      name: "Ratna Dewi", email: "csr@mandiri-foundation.id", password: "hashed_Password123!", role: "PERUSAHAAN",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const companyUser3 = await ctx.db.insert("users", {
      name: "Hendra Wijaya", email: "csr@telkom-peduli.id", password: "hashed_Password123!", role: "PERUSAHAAN",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const ngoUser1 = await ctx.db.insert("users", {
      name: "Siti Rahayu", email: "ketua@yayasan-cerdas.org", password: "hashed_Password123!", role: "PENGUSUL",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const ngoUser2 = await ctx.db.insert("users", {
      name: "Dr. Bambang Priyatno", email: "direktur@lingkunganhijau.org", password: "hashed_Password123!", role: "PENGUSUL",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const ngoUser3 = await ctx.db.insert("users", {
      name: "Fatimah Azzahra", email: "pimpinan@komunitas-sehat.org", password: "hashed_Password123!", role: "PENGUSUL",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    const ngoUser4 = await ctx.db.insert("users", {
      name: "Rudi Prasetyo", email: "direktur@digitaldesa.id", password: "hashed_Password123!", role: "PENGUSUL",
      isActive: true, isSuspended: false, twoFactorEnabled: false, loginAttempts: 0, mustChangePassword: false,
      emailVerified: now, updatedAt: now,
    });

    return { superAdmin, adminPlatform, verifikator, auditor, companyUser1, companyUser2, companyUser3, ngoUser1, ngoUser2, ngoUser3, ngoUser4 };
  },
});

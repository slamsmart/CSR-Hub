import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const seedAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Step 1: Seed users
    const users = await ctx.runMutation(internal.seedUsers.seedUsers, {});

    // Step 2: Seed organizations (depends on user IDs)
    const orgs = await ctx.runMutation(internal.seedOrganizations.seedOrganizations, {
      companyUser1: users.companyUser1,
      companyUser2: users.companyUser2,
      companyUser3: users.companyUser3,
      ngoUser1: users.ngoUser1,
      ngoUser2: users.ngoUser2,
      ngoUser3: users.ngoUser3,
      ngoUser4: users.ngoUser4,
    });

    // Step 3: Seed proposals & projects (depends on org + user IDs)
    await ctx.runMutation(internal.seedProposals.seedProposalsAndProjects, {
      orgCerdas: orgs.orgCerdas,
      orgHijau: orgs.orgHijau,
      orgSehat: orgs.orgSehat,
      orgDigital: orgs.orgDigital,
      orgPertamina: orgs.orgPertamina,
      orgMandiri: orgs.orgMandiri,
      orgTelkom: orgs.orgTelkom,
      ngoUser1: users.ngoUser1,
      ngoUser2: users.ngoUser2,
      ngoUser3: users.ngoUser3,
      ngoUser4: users.ngoUser4,
      adminPlatform: users.adminPlatform,
    });

    return "✅ Seed selesai!";
  },
});

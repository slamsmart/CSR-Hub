import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const organizationsTable = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  description: text("description"),
  logoUrl: text("logo_url"),
  website: text("website"),
  province: text("province"),
  city: text("city"),
  address: text("address"),
  phone: text("phone"),
  email: text("email"),
  npwp: text("npwp"),
  legalStatus: text("legal_status"),
  verificationStatus: text("verification_status").notNull().default("pending"),
  trustScore: integer("trust_score").default(0),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
  totalProposals: integer("total_proposals").notNull().default(0),
  totalFunded: integer("total_funded").notNull().default(0),
  successRate: text("success_rate").notNull().default("0"),
  focusAreas: text("focus_areas").array().notNull().default([]),
  sdgGoals: integer("sdg_goals").array().notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertOrganizationSchema = createInsertSchema(organizationsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type Organization = typeof organizationsTable.$inferSelect;

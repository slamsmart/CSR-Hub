import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cofundingCommitmentsTable = pgTable("cofunding_commitments", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  organizationId: integer("organization_id").notNull(),
  amount: integer("amount").notNull(),
  percentageShare: text("percentage_share").notNull().default("0"),
  status: text("status").notNull().default("committed"),
  notes: text("notes"),
  committedAt: timestamp("committed_at", { withTimezone: true }).notNull().defaultNow(),
  confirmedAt: timestamp("confirmed_at", { withTimezone: true }),
});

export const insertCofundingSchema = createInsertSchema(cofundingCommitmentsTable).omit({ id: true, committedAt: true });
export type InsertCofunding = z.infer<typeof insertCofundingSchema>;
export type CofundingCommitment = typeof cofundingCommitmentsTable.$inferSelect;

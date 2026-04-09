import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const proposalsTable = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  description: text("description").notNull().default(""),
  category: text("category").notNull(),
  status: text("status").notNull().default("draft"),
  organizationId: integer("organization_id").notNull(),
  province: text("province").notNull(),
  city: text("city"),
  targetBeneficiaries: integer("target_beneficiaries").notNull().default(0),
  budgetTotal: integer("budget_total").notNull().default(0),
  fundedAmount: integer("funded_amount").notNull().default(0),
  startDate: text("start_date"),
  endDate: text("end_date"),
  sdgGoals: integer("sdg_goals").array().notNull().default([]),
  tags: text("tags").array().notNull().default([]),
  aiScore: integer("ai_score"),
  aiSummary: text("ai_summary"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const proposalBudgetItemsTable = pgTable("proposal_budget_items", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  description: text("description").notNull(),
  amount: integer("amount").notNull(),
  category: text("category").notNull().default("umum"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const proposalStatusHistoryTable = pgTable("proposal_status_history", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull(),
  status: text("status").notNull(),
  notes: text("notes"),
  changedBy: integer("changed_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProposalSchema = createInsertSchema(proposalsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type Proposal = typeof proposalsTable.$inferSelect;

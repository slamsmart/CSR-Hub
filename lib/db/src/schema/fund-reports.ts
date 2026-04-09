import { pgTable, serial, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const fundReportStatusEnum = pgEnum("fund_report_status", [
  "draft", "submitted", "under_review", "approved", "revision_needed"
]);

export const fundReportsTable = pgTable("fund_reports", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id"),
  organizationId: integer("organization_id").notNull(),
  programName: text("program_name").notNull(),
  reportPeriodStart: text("report_period_start").notNull(),
  reportPeriodEnd: text("report_period_end").notNull(),
  totalFundReceived: integer("total_fund_received").notNull().default(0),
  totalFundUsed: integer("total_fund_used").notNull().default(0),
  filename: text("filename").notNull(),
  fileMimeType: text("file_mime_type").notNull().default("application/pdf"),
  fileSize: integer("file_size").notNull().default(0),
  fileContent: text("file_content").notNull(),
  status: fundReportStatusEnum("status").notNull().default("submitted"),
  notes: text("notes"),
  reviewNotes: text("review_notes"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFundReportSchema = createInsertSchema(fundReportsTable).omit({
  id: true, createdAt: true, updatedAt: true, submittedAt: true, reviewedAt: true,
});
export const selectFundReportSchema = createSelectSchema(fundReportsTable);
export type FundReport = typeof fundReportsTable.$inferSelect;
export type NewFundReport = typeof fundReportsTable.$inferInsert;

import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const projectsTable = pgTable("projects", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull().unique(),
  status: text("status").notNull().default("aktif"),
  budgetUsed: integer("budget_used").notNull().default(0),
  progressPercent: integer("progress_percent").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const projectMilestonesTable = pgTable("project_milestones", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: text("due_date"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  status: text("status").notNull().default("belum"),
  progressPercent: integer("progress_percent").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const projectReportsTable = pgTable("project_reports", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  reportType: text("report_type").notNull().default("progres"),
  budgetUsed: integer("budget_used"),
  beneficiariesCount: integer("beneficiaries_count"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertProjectSchema = createInsertSchema(projectsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projectsTable.$inferSelect;

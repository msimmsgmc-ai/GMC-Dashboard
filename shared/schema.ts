import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Properties table
export const properties = sqliteTable("properties", {
  id: text("id").primaryKey(), // e.g. "jordan_station", "oakleaf"
  name: text("name").notNull(),
  classification: text("classification").notNull(), // e.g. "Class A"
  units: integer("units").notNull(),
  isNew: integer("is_new", { mode: "boolean" }).default(false),
  sortOrder: integer("sort_order").notNull(),
});

// Quarter targets per property
export const targets = sqliteTable("targets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: text("property_id").notNull(),
  year: integer("year").notNull(),
  quarter: text("quarter").notNull(), // "Q1", "Q2", "Q3", "Q4"

  // Occupancy targets (%)
  occupancyQ1Target: real("occupancy_q1_target"),
  occupancyYearTarget: real("occupancy_year_target"),

  // Metric targets
  totalLeadsQTarget: integer("total_leads_q_target"),
  totalLeadsYearTarget: integer("total_leads_year_target"),
  moveInsQTarget: integer("move_ins_q_target"),
  moveInsYearTarget: integer("move_ins_year_target"),
  moveOutsQTarget: integer("move_outs_q_target"),
  moveOutsYearTarget: integer("move_outs_year_target"),
  tourRateQTarget: real("tour_rate_q_target"),
  tourRateYearTarget: real("tour_rate_year_target"),
  ltmiQTarget: real("ltmi_q_target"),
  ltmiYearTarget: real("ltmi_year_target"),
  notReadyQTarget: integer("not_ready_q_target"),
  notReadyYearTarget: integer("not_ready_year_target"),
  denialRateQTarget: real("denial_rate_q_target"),
  denialRateYearTarget: real("denial_rate_year_target"),
});

// Quarterly actuals per property
export const actuals = sqliteTable("actuals", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: text("property_id").notNull(),
  year: integer("year").notNull(),
  quarter: text("quarter").notNull(), // "Q1", "Q2", etc.
  periodLabel: text("period_label").notNull(), // e.g. "01/01/2026 - 03/31/2026"

  // Occupancy (%)
  occupancy: real("occupancy"),

  // Baseline / start of year
  occupancyStart: real("occupancy_start"),
  tourRateStart: real("tour_rate_start"),
  ltmiStart: real("ltmi_start"),
  notReadyStart: integer("not_ready_start"),
  denialRateStart: real("denial_rate_start"),

  // Actuals
  totalLeads: integer("total_leads"),
  totalTours: integer("total_tours"),
  moveIns: integer("move_ins"),
  moveOuts: integer("move_outs"),
  evictions: integer("evictions"),
  tourRate: real("tour_rate"),
  ltmi: real("ltmi"),
  notReady: integer("not_ready"),
  denialRate: real("denial_rate"),

  // Derived from box score
  rentableUnits: integer("rentable_units"),
  occupiedUnits: integer("occupied_units"),
  vacantUnits: integer("vacant_units"),
  notReadyVacantPct: real("not_ready_vacant_pct"),
});

// Key findings / narrative per property per quarter
export const findings = sqliteTable("findings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  propertyId: text("property_id").notNull(),
  year: integer("year").notNull(),
  quarter: text("quarter").notNull(),
  bullets: text("bullets").notNull(), // JSON array of strings
});

export const insertActualsSchema = createInsertSchema(actuals).omit({ id: true });
export const insertFindingsSchema = createInsertSchema(findings).omit({ id: true });
export type Property = typeof properties.$inferSelect;
export type Target = typeof targets.$inferSelect;
export type Actual = typeof actuals.$inferSelect;
export type Finding = typeof findings.$inferSelect;
export type InsertActual = z.infer<typeof insertActualsSchema>;

import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq, and } from "drizzle-orm";
import { properties, targets, actuals, findings } from "@shared/schema";
import type { Property, Target, Actual, Finding } from "@shared/schema";

const sqlite = new Database("portfolio.db");
export const db = drizzle(sqlite);

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    classification TEXT NOT NULL,
    units INTEGER NOT NULL,
    is_new INTEGER DEFAULT 0,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS targets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id TEXT NOT NULL,
    year INTEGER NOT NULL,
    quarter TEXT NOT NULL,
    occupancy_q1_target REAL,
    occupancy_year_target REAL,
    total_leads_q_target INTEGER,
    total_leads_year_target INTEGER,
    move_ins_q_target INTEGER,
    move_ins_year_target INTEGER,
    move_outs_q_target INTEGER,
    move_outs_year_target INTEGER,
    tour_rate_q_target REAL,
    tour_rate_year_target REAL,
    ltmi_q_target REAL,
    ltmi_year_target REAL,
    not_ready_q_target INTEGER,
    not_ready_year_target INTEGER,
    denial_rate_q_target REAL,
    denial_rate_year_target REAL
  );

  CREATE TABLE IF NOT EXISTS actuals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id TEXT NOT NULL,
    year INTEGER NOT NULL,
    quarter TEXT NOT NULL,
    period_label TEXT NOT NULL,
    occupancy REAL,
    occupancy_start REAL,
    tour_rate_start REAL,
    ltmi_start REAL,
    not_ready_start INTEGER,
    denial_rate_start REAL,
    total_leads INTEGER,
    total_tours INTEGER,
    move_ins INTEGER,
    move_outs INTEGER,
    evictions INTEGER,
    tour_rate REAL,
    ltmi REAL,
    not_ready INTEGER,
    denial_rate REAL,
    rentable_units INTEGER,
    occupied_units INTEGER,
    vacant_units INTEGER,
    not_ready_vacant_pct REAL
  );

  CREATE TABLE IF NOT EXISTS findings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id TEXT NOT NULL,
    year INTEGER NOT NULL,
    quarter TEXT NOT NULL,
    bullets TEXT NOT NULL
  );
`);

export interface IStorage {
  getProperties(): Property[];
  getTargets(year: number): Target[];
  getActuals(year: number, quarter: string): Actual[];
  getAllActuals(year: number): Actual[];
  getFindings(year: number, quarter: string): Finding[];
  upsertActual(data: Omit<Actual, "id">): void;
  upsertFinding(data: Omit<Finding, "id">): void;
  seedData(): void;
  isSeeded(): boolean;
}

export class Storage implements IStorage {
  getProperties(): Property[] {
    return db.select().from(properties).all();
  }

  getTargets(year: number): Target[] {
    return db.select().from(targets).where(eq(targets.year, year)).all();
  }

  getActuals(year: number, quarter: string): Actual[] {
    return db.select().from(actuals)
      .where(and(eq(actuals.year, year), eq(actuals.quarter, quarter)))
      .all();
  }

  getAllActuals(year: number): Actual[] {
    return db.select().from(actuals).where(eq(actuals.year, year)).all();
  }

  getFindings(year: number, quarter: string): Finding[] {
    return db.select().from(findings)
      .where(and(eq(findings.year, year), eq(findings.quarter, quarter)))
      .all();
  }

  upsertActual(data: Omit<Actual, "id">): void {
    const existing = db.select().from(actuals)
      .where(and(
        eq(actuals.propertyId, data.propertyId),
        eq(actuals.year, data.year),
        eq(actuals.quarter, data.quarter)
      )).get();

    if (existing) {
      sqlite.prepare(`
        UPDATE actuals SET
          period_label=?, occupancy=?, occupancy_start=?, tour_rate_start=?, ltmi_start=?,
          not_ready_start=?, denial_rate_start=?, total_leads=?, total_tours=?, move_ins=?,
          move_outs=?, evictions=?, tour_rate=?, ltmi=?, not_ready=?, denial_rate=?,
          rentable_units=?, occupied_units=?, vacant_units=?, not_ready_vacant_pct=?
        WHERE property_id=? AND year=? AND quarter=?
      `).run(
        data.periodLabel, data.occupancy, data.occupancyStart, data.tourRateStart, data.ltmiStart,
        data.notReadyStart, data.denialRateStart, data.totalLeads, data.totalTours, data.moveIns,
        data.moveOuts, data.evictions, data.tourRate, data.ltmi, data.notReady, data.denialRate,
        data.rentableUnits, data.occupiedUnits, data.vacantUnits, data.notReadyVacantPct,
        data.propertyId, data.year, data.quarter
      );
    } else {
      db.insert(actuals).values(data).run();
    }
  }

  upsertFinding(data: Omit<Finding, "id">): void {
    const existing = db.select().from(findings)
      .where(and(
        eq(findings.propertyId, data.propertyId),
        eq(findings.year, data.year),
        eq(findings.quarter, data.quarter)
      )).get();

    if (existing) {
      sqlite.prepare(`
        UPDATE findings SET bullets=? WHERE property_id=? AND year=? AND quarter=?
      `).run(data.bullets, data.propertyId, data.year, data.quarter);
    } else {
      db.insert(findings).values(data).run();
    }
  }

  isSeeded(): boolean {
    const count = db.select().from(properties).all().length;
    return count > 0;
  }

  seedData(): void {
    if (this.isSeeded()) return;

    // Seed properties
    const propData: Property[] = [
      { id: "jordan_station", name: "Jordan Station I+II", classification: "Class A", units: 536, isNew: false, sortOrder: 1 },
      { id: "oakleaf", name: "Oakleaf Village", classification: "Class A-", units: 354, isNew: false, sortOrder: 2 },
      { id: "oakview", name: "Oakview Landing", classification: "Class C", units: 215, isNew: false, sortOrder: 3 },
      { id: "pier5350", name: "Pier 5350", classification: "Class B-", units: 398, isNew: true, sortOrder: 4 },
      { id: "hendricks", name: "The Hendricks at San Marco", classification: "Class A lux", units: 132, isNew: false, sortOrder: 5 },
    ];
    for (const p of propData) {
      db.insert(properties).values(p).run();
    }

    // Seed 2026 targets (from PDF)
    const targetData: Omit<Target, "id">[] = [
      {
        propertyId: "jordan_station", year: 2026, quarter: "Q1",
        occupancyQ1Target: 0.89, occupancyYearTarget: 0.94,
        totalLeadsQTarget: 709, totalLeadsYearTarget: 2835,
        moveInsQTarget: 60, moveInsYearTarget: 241,
        moveOutsQTarget: 54, moveOutsYearTarget: 214,
        tourRateQTarget: 0.20, tourRateYearTarget: 0.282,
        ltmiQTarget: 0.085, ltmiYearTarget: 0.085,
        notReadyQTarget: 22, notReadyYearTarget: 19,
        denialRateQTarget: 0.10, denialRateYearTarget: 0.10,
      },
      {
        propertyId: "oakleaf", year: 2026, quarter: "Q1",
        occupancyQ1Target: 0.89, occupancyYearTarget: 0.94,
        totalLeadsQTarget: 464, totalLeadsYearTarget: 1858,
        moveInsQTarget: 40, moveInsYearTarget: 158,
        moveOutsQTarget: 35, moveOutsYearTarget: 142,
        tourRateQTarget: 0.165, tourRateYearTarget: 0.185,
        ltmiQTarget: 0.085, ltmiYearTarget: 0.085,
        notReadyQTarget: 16, notReadyYearTarget: 12,
        denialRateQTarget: 0.25, denialRateYearTarget: 0.20,
      },
      {
        propertyId: "oakview", year: 2026, quarter: "Q1",
        occupancyQ1Target: 0.87, occupancyYearTarget: 0.94,
        totalLeadsQTarget: 303, totalLeadsYearTarget: 1211,
        moveInsQTarget: 26, moveInsYearTarget: 103,
        moveOutsQTarget: 22, moveOutsYearTarget: 86,
        tourRateQTarget: 0.14, tourRateYearTarget: 0.201,
        ltmiQTarget: 0.085, ltmiYearTarget: 0.085,
        notReadyQTarget: 17, notReadyYearTarget: 8,
        denialRateQTarget: 0.33, denialRateYearTarget: 0.33,
      },
      {
        propertyId: "pier5350", year: 2026, quarter: "Q1",
        occupancyQ1Target: 0.89, occupancyYearTarget: 0.94,
        totalLeadsQTarget: 512, totalLeadsYearTarget: 2047,
        moveInsQTarget: 44, moveInsYearTarget: 174,
        moveOutsQTarget: 40, moveOutsYearTarget: 159,
        tourRateQTarget: 0.20, tourRateYearTarget: 0.243,
        ltmiQTarget: 0.085, ltmiYearTarget: 0.085,
        notReadyQTarget: 20, notReadyYearTarget: 14,
        denialRateQTarget: 0.18, denialRateYearTarget: 0.15,
      },
      {
        propertyId: "hendricks", year: 2026, quarter: "Q1",
        occupancyQ1Target: 0.93, occupancyYearTarget: 0.94,
        totalLeadsQTarget: 150, totalLeadsYearTarget: 600,
        moveInsQTarget: 13, moveInsYearTarget: 51,
        moveOutsQTarget: 13, moveOutsYearTarget: 53,
        tourRateQTarget: 0.399, tourRateYearTarget: 0.399,
        ltmiQTarget: 0.085, ltmiYearTarget: 0.085,
        notReadyQTarget: 5, notReadyYearTarget: 5,
        denialRateQTarget: 0.10, denialRateYearTarget: 0.10,
      },
    ];
    for (const t of targetData) {
      db.insert(targets).values(t).run();
    }

    // Seed Q1 2026 actuals (from Box Score + PDF baselines)
    // Jordan Station I+II = East (302 units) + West (236 units) combined
    // East: occupied=269, West: occupied=204, total=473, rentable=536
    // Occupancy = 473/536 = 88.25% (matches PDF)
    // Leads: East 679, West 91 = 770... but PDF says 763. Using PDF value.
    // Tours: East 204, West 30 = 234... PDF derived from tour_rate
    // Move-ins: East 31 + West 31 = 62 ✓
    // Move-outs: East 27 + West 19 = 46 ✓
    // Denials: East 4+2=6 total denied out of 63+47=110 completed apps = 5.5% ✓
    // Not-ready: East 15 + West 10 = 25 ✓
    // LTMI: 62/763 = 8.13% ✓
    // Tour rate: tours/leads. PDF 30.5% × 763 = 233 tours / 763 = 30.5%
    const actualsData: Omit<Actual, "id">[] = [
      {
        propertyId: "jordan_station", year: 2026, quarter: "Q1",
        periodLabel: "01/01/2026 - 03/31/2026",
        occupancy: 0.8825,
        occupancyStart: null,
        tourRateStart: 0.155,
        ltmiStart: 0.053,
        notReadyStart: 35,
        denialRateStart: null,
        totalLeads: 763,
        totalTours: 233,
        moveIns: 62,
        moveOuts: 46,
        evictions: 1,
        tourRate: 0.305,
        ltmi: 0.081,
        notReady: 25,
        denialRate: 0.055,
        rentableUnits: 536,
        occupiedUnits: 473,
        vacantUnits: 63,
        notReadyVacantPct: 0.397,
      },
      {
        propertyId: "oakleaf", year: 2026, quarter: "Q1",
        periodLabel: "01/01/2026 - 03/31/2026",
        occupancy: 0.8701,
        occupancyStart: null,
        tourRateStart: 0.149,
        ltmiStart: 0.085,
        notReadyStart: 20,
        denialRateStart: 0.29,
        totalLeads: 260,
        totalTours: 69,
        moveIns: 27,
        moveOuts: 32,
        evictions: 1,
        tourRate: 0.265,
        ltmi: 0.104,
        notReady: 21,
        denialRate: 0.314,
        rentableUnits: 354,
        occupiedUnits: 308,
        vacantUnits: 46,
        notReadyVacantPct: 0.457,
      },
      {
        propertyId: "oakview", year: 2026, quarter: "Q1",
        periodLabel: "01/01/2026 - 03/31/2026",
        occupancy: 0.8326,
        occupancyStart: 0.833,
        tourRateStart: 0.101,
        ltmiStart: 0.05,
        notReadyStart: 26,
        denialRateStart: 0.33,
        totalLeads: 405,
        totalTours: 96,
        moveIns: 11,
        moveOuts: 24,
        evictions: 6,
        tourRate: 0.237,
        ltmi: 0.027,
        notReady: 18,
        denialRate: 0.277,
        rentableUnits: 215,
        occupiedUnits: 176,
        vacantUnits: 39,
        notReadyVacantPct: 0.462,
      },
      {
        propertyId: "pier5350", year: 2026, quarter: "Q1",
        periodLabel: "01/01/2026 - 03/31/2026",
        occupancy: 0.8719,
        occupancyStart: null,
        tourRateStart: null,
        ltmiStart: null,
        notReadyStart: 26,
        denialRateStart: null,
        totalLeads: 499,
        totalTours: 107,
        moveIns: 30,
        moveOuts: 34,
        evictions: 4,
        tourRate: 0.214,
        ltmi: 0.060,
        notReady: 26,
        denialRate: 0.438,
        rentableUnits: 398,
        occupiedUnits: 347,
        vacantUnits: 51,
        notReadyVacantPct: 0.510,
      },
      {
        propertyId: "hendricks", year: 2026, quarter: "Q1",
        periodLabel: "01/01/2026 - 03/31/2026",
        occupancy: 0.9394,
        occupancyStart: null,
        tourRateStart: 0.534,
        ltmiStart: 0.125,
        notReadyStart: 6,
        denialRateStart: 0.04,
        totalLeads: 120,
        totalTours: 51,
        moveIns: 16,
        moveOuts: 9,
        evictions: 0,
        tourRate: 0.418,
        ltmi: 0.131,
        notReady: 3,
        denialRate: 0.10,
        rentableUnits: 132,
        occupiedUnits: 124,
        vacantUnits: 8,
        notReadyVacantPct: 0.375,
      },
    ];
    for (const a of actualsData) {
      db.insert(actuals).values(a).run();
    }

    // Seed Q1 findings
    const findingsData: Omit<Finding, "id">[] = [
      {
        propertyId: "jordan_station", year: 2026, quarter: "Q1",
        bullets: JSON.stringify([
          "Tour rate at 30.5% vs. Q1 target of 20% — conversion work is ahead of schedule. Don't change what's driving this.",
          "LTMI at 8.1% is just under the 8.5% target — the funnel is converting but 25 not-ready units are capping how many leads can actually move in.",
          "Make-ready is the only real lever left — get from 25 to 19 not-ready units and the occupancy gap largely closes itself."
        ])
      },
      {
        propertyId: "oakleaf", year: 2026, quarter: "Q1",
        bullets: JSON.stringify([
          "Denial rate went the wrong direction — started at 29%, now at 31.4%, moving away from the 18-22% target. Fixing the root cause unlocks $265K in annual revenue at zero additional marketing spend.",
          "Lead volume is the secondary problem — 260 leads against a Q1 target of 464. The top of funnel is genuinely underfed, unlike Jordan Station and Oakview where leads are sufficient.",
          "Not-ready units went from 20 to 21 — effectively no progress. Needs the same urgency as Oakview.",
          "Tour rate is strong at 26.5% against an 18.5% year target — the mid-funnel is working. The denial bleed and lead shortage are the bottlenecks."
        ])
      },
      {
        propertyId: "oakview", year: 2026, quarter: "Q1",
        bullets: JSON.stringify([
          "This property is in crisis and needs to be treated as one. Occupancy didn't move a single point in Q1 — 83.26% versus an 83.3% start.",
          "Only 11 move-ins against a quarterly target of 26 — less than half of what's needed.",
          "6 evictions in Q1 is the highest in the portfolio and is directly eating back any occupancy gains.",
          "18 not-ready units at 46% of vacant stock — every unit sitting not-ready is $1,255/month in preventable loss. This is still an operational emergency.",
          "LTMI collapsed to 2.7% — leads are coming in but almost nothing is converting. The make-ready backlog is the primary reason — you can't lease what you can't show."
        ])
      },
      {
        propertyId: "pier5350", year: 2026, quarter: "Q1",
        bullets: JSON.stringify([
          "The 43.8% denial rate is the most urgent unresolved issue in the entire portfolio. B-minus benchmark is 18-25%. Root cause resolution must come before additional marketing spend.",
          "Make-ready made zero progress — 26 not-ready units at the start, 26 at the end of Q1. Nothing moved.",
          "Move-ins at 30 against a Q1 target of 44 — the denial rate and make-ready backlog are directly causing this shortfall.",
          "Tour rate at 21.4% is above the Q1 target of 20% — leasing is converting leads to tours. The problem is downstream at application and make-ready, not at the top of the funnel."
        ])
      },
      {
        propertyId: "hendricks", year: 2026, quarter: "Q1",
        bullets: JSON.stringify([
          "Leave it alone. Every metric is at or above target.",
          "One exception: Apartments.com spent $8,557 in Q1 and produced zero move-ins on 5 leads. Cut it and redirect to Google Ads which is producing results.",
          "At 93.94% occupancy you are two units from the 94% target — those two units fill themselves if the 3 not-ready units get resolved."
        ])
      },
    ];
    for (const f of findingsData) {
      db.insert(findings).values(f).run();
    }
  }
}

export const storage = new Storage();

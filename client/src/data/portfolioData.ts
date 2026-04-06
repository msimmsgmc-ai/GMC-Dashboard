// Static portfolio data — update this file each quarter when you drop new Box Score data
// Q1 2026 data loaded from Box Score export dated 04/05/2026

export interface Property {
  id: string;
  name: string;
  classification: string;
  units: number;
  isNew: boolean;
  sortOrder: number;
}

export interface Target {
  propertyId: string;
  year: number;
  quarter: string;
  occupancyQTarget: number;
  occupancyYearTarget: number;
  totalLeadsQTarget: number;
  totalLeadsYearTarget: number;
  moveInsQTarget: number;
  moveInsYearTarget: number;
  moveOutsQTarget: number;
  moveOutsYearTarget: number;
  tourRateQTarget: number;
  tourRateYearTarget: number;
  ltmiQTarget: number;
  ltmiYearTarget: number;
  notReadyQTarget: number;
  notReadyYearTarget: number;
  denialRateQTarget: number;
  denialRateYearTarget: number;
}

export interface Actual {
  propertyId: string;
  year: number;
  quarter: string;
  periodLabel: string;
  occupancy: number | null;
  occupancyStart: number | null;
  totalLeadsStart: number | null;
  moveInsStart: number | null;
  moveOutsStart: number | null;
  tourRateStart: number | null;
  ltmiStart: number | null;
  notReadyStart: number | null;
  denialRateStart: number | null;
  totalLeads: number | null;
  totalTours: number | null;
  moveIns: number | null;
  moveOuts: number | null;
  evictions: number | null;
  tourRate: number | null;
  ltmi: number | null;
  notReady: number | null;
  denialRate: number | null;
  rentableUnits: number | null;
  occupiedUnits: number | null;
  vacantUnits: number | null;
}

export interface Finding {
  propertyId: string;
  year: number;
  quarter: string;
  bullets: string[];
}

export const properties: Property[] = [
  { id: "jordan_station", name: "Jordan Station I+II", classification: "Class A", units: 536, isNew: false, sortOrder: 1 },
  { id: "oakleaf", name: "Oakleaf Village", classification: "Class A-", units: 354, isNew: false, sortOrder: 2 },
  { id: "oakview", name: "Oakview Landing", classification: "Class C", units: 215, isNew: false, sortOrder: 3 },
  { id: "pier5350", name: "Pier 5350", classification: "Class B-", units: 398, isNew: true, sortOrder: 4 },
  { id: "hendricks", name: "The Hendricks at San Marco", classification: "Class A lux", units: 132, isNew: false, sortOrder: 5 },
];

export const targets2026: Target[] = [
  {
    propertyId: "jordan_station", year: 2026, quarter: "Q1",
    occupancyQTarget: 0.89, occupancyYearTarget: 0.94,
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
    occupancyQTarget: 0.89, occupancyYearTarget: 0.94,
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
    occupancyQTarget: 0.87, occupancyYearTarget: 0.94,
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
    occupancyQTarget: 0.89, occupancyYearTarget: 0.94,
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
    occupancyQTarget: 0.93, occupancyYearTarget: 0.94,
    totalLeadsQTarget: 150, totalLeadsYearTarget: 600,
    moveInsQTarget: 13, moveInsYearTarget: 51,
    moveOutsQTarget: 13, moveOutsYearTarget: 53,
    tourRateQTarget: 0.399, tourRateYearTarget: 0.399,
    ltmiQTarget: 0.085, ltmiYearTarget: 0.085,
    notReadyQTarget: 5, notReadyYearTarget: 5,
    denialRateQTarget: 0.10, denialRateYearTarget: 0.10,
  },
];

// Q2 2026 targets (same structure — will be populated when Q2 data arrives)
// To add Q2 targets, push to this array with quarter: "Q2"

export const actuals: Actual[] = [
  // ── Q1 2026 ──────────────────────────────────────────────────
  // Jordan Station I+II (East 302 units + West 236 units combined)
  {
    propertyId: "jordan_station", year: 2026, quarter: "Q1",
    periodLabel: "01/01/2026 – 03/31/2026",
    occupancy: 0.8825, occupancyStart: null,
    totalLeadsStart: 3518, moveInsStart: 185, moveOutsStart: 243,
    tourRateStart: 0.155, ltmiStart: 0.053,
    notReadyStart: 35, denialRateStart: null,
    totalLeads: 763, totalTours: 233,
    moveIns: 62, moveOuts: 46, evictions: 1,
    tourRate: 0.305, ltmi: 0.081,
    notReady: 25, denialRate: 0.055,
    rentableUnits: 536, occupiedUnits: 473, vacantUnits: 63,
  },
  // Oakleaf Village
  {
    propertyId: "oakleaf", year: 2026, quarter: "Q1",
    periodLabel: "01/01/2026 – 03/31/2026",
    occupancy: 0.8701, occupancyStart: null,
    totalLeadsStart: 1183, moveInsStart: 101, moveOutsStart: 134,
    tourRateStart: 0.149, ltmiStart: 0.085,
    notReadyStart: 20, denialRateStart: 0.29,
    totalLeads: 260, totalTours: 69,
    moveIns: 27, moveOuts: 32, evictions: 1,
    tourRate: 0.265, ltmi: 0.104,
    notReady: 21, denialRate: 0.314,
    rentableUnits: 354, occupiedUnits: 308, vacantUnits: 46,
  },
  // Oakview Landing
  {
    propertyId: "oakview", year: 2026, quarter: "Q1",
    periodLabel: "01/01/2026 – 03/31/2026",
    occupancy: 0.8326, occupancyStart: 0.833,
    totalLeadsStart: 2200, moveInsStart: 116, moveOutsStart: 129,
    tourRateStart: 0.101, ltmiStart: 0.05,
    notReadyStart: 26, denialRateStart: 0.33,
    totalLeads: 405, totalTours: 96,
    moveIns: 11, moveOuts: 24, evictions: 6,
    tourRate: 0.237, ltmi: 0.027,
    notReady: 18, denialRate: 0.277,
    rentableUnits: 215, occupiedUnits: 176, vacantUnits: 39,
  },
  // Pier 5350 (new acquisition)
  {
    propertyId: "pier5350", year: 2026, quarter: "Q1",
    periodLabel: "01/01/2026 – 03/31/2026",
    occupancy: 0.8719, occupancyStart: null,
    totalLeadsStart: null, moveInsStart: null, moveOutsStart: null,
    tourRateStart: null, ltmiStart: null,
    notReadyStart: 26, denialRateStart: null,
    totalLeads: 499, totalTours: 107,
    moveIns: 30, moveOuts: 34, evictions: 4,
    tourRate: 0.214, ltmi: 0.060,
    notReady: 26, denialRate: 0.438,
    rentableUnits: 398, occupiedUnits: 347, vacantUnits: 51,
  },
  // The Hendricks at San Marco
  {
    propertyId: "hendricks", year: 2026, quarter: "Q1",
    periodLabel: "01/01/2026 – 03/31/2026",
    occupancy: 0.9394, occupancyStart: null,
    totalLeadsStart: 536, moveInsStart: 67, moveOutsStart: 74,
    tourRateStart: 0.534, ltmiStart: 0.125,
    notReadyStart: 6, denialRateStart: 0.04,
    totalLeads: 120, totalTours: 51,
    moveIns: 16, moveOuts: 9, evictions: 0,
    tourRate: 0.418, ltmi: 0.131,
    notReady: 3, denialRate: 0.10,
    rentableUnits: 132, occupiedUnits: 124, vacantUnits: 8,
  },

  // ── Q2 2026 placeholder ───────────────────────────────────────
  // Uncomment and fill in when you send the Q2 Box Score
  // { propertyId: "jordan_station", year: 2026, quarter: "Q2", periodLabel: "04/01/2026 – 06/30/2026", ... }
];

export const findings: Finding[] = [
  {
    propertyId: "jordan_station", year: 2026, quarter: "Q1",
    bullets: [
      "Tour rate at 30.5% vs. Q1 target of 20% — conversion work is ahead of schedule. Don't change what's driving this.",
      "LTMI at 8.1% is just under the 8.5% target — the funnel is converting but 25 not-ready units are capping how many leads can actually move in.",
      "Make-ready is the only real lever left — get from 25 to 19 not-ready units and the occupancy gap largely closes itself.",
    ],
  },
  {
    propertyId: "oakleaf", year: 2026, quarter: "Q1",
    bullets: [
      "Denial rate went the wrong direction — started at 29%, now at 31.4%, moving away from the 18–22% target. Fixing the root cause unlocks $265K in annual revenue at zero additional marketing spend.",
      "Lead volume is the secondary problem — 260 leads against a Q1 target of 464. The top of funnel is genuinely underfed, unlike Jordan Station and Oakview where leads are sufficient.",
      "Not-ready units went from 20 to 21 — effectively no progress. Needs the same urgency as Oakview.",
      "Tour rate is strong at 26.5% against an 18.5% year target — the mid-funnel is working. The denial bleed and lead shortage are the bottlenecks.",
    ],
  },
  {
    propertyId: "oakview", year: 2026, quarter: "Q1",
    bullets: [
      "This property is in crisis and needs to be treated as one. Occupancy didn't move a single point in Q1 — 83.26% versus an 83.3% start.",
      "Only 11 move-ins against a quarterly target of 26 — less than half of what's needed.",
      "6 evictions in Q1 is the highest in the portfolio and is directly eating back any occupancy gains.",
      "18 not-ready units at 46% of vacant stock — every unit sitting not-ready is $1,255/month in preventable loss. This is still an operational emergency.",
      "LTMI collapsed to 2.7% — leads are coming in but almost nothing is converting. The make-ready backlog is the primary reason — you can't lease what you can't show.",
    ],
  },
  {
    propertyId: "pier5350", year: 2026, quarter: "Q1",
    bullets: [
      "The 43.8% denial rate is the most urgent unresolved issue in the entire portfolio. B-minus benchmark is 18–25%. Root cause resolution must come before additional marketing spend.",
      "Make-ready made zero progress — 26 not-ready units at the start, 26 at the end of Q1. Nothing moved.",
      "Move-ins at 30 against a Q1 target of 44 — the denial rate and make-ready backlog are directly causing this shortfall.",
      "Tour rate at 21.4% is above the Q1 target of 20% — leasing is converting leads to tours. The problem is downstream at application and make-ready, not at the top of the funnel.",
    ],
  },
  {
    propertyId: "hendricks", year: 2026, quarter: "Q1",
    bullets: [
      "Leave it alone. Every metric is at or above target.",
      "One exception: Apartments.com spent $8,557 in Q1 and produced zero move-ins on 5 leads. Cut it and redirect to Google Ads which is producing results.",
      "At 93.94% occupancy you are two units from the 94% target — those two units fill themselves if the 3 not-ready units get resolved.",
    ],
  },
];

// ── FINANCIALS (Budget vs Actual) ────────────────────────────────────────────
// Updated from Income Statement - Budget vs Actual, Q1 2026 (Jan-Mar)
// Jordan Station = East + West combined

export interface FinancialLine {
  label: string;
  actual: number;
  budget: number;
}

export interface PropertyFinancials {
  propertyId: string;
  year: number;
  quarter: string;
  periodLabel: string;
  lines: FinancialLine[];
}

export const financials: PropertyFinancials[] = [
  {
    propertyId: "jordan_station", year: 2026, quarter: "Q1",
    periodLabel: "Jan – Mar 2026",
    lines: [
      { label: "Total Income",        actual: 2486365.76, budget: 2539935.50 },
      { label: "Personnel",           actual:  208563.02, budget:  218673.00 },
      { label: "Repair & Maintenance", actual:   35190.51, budget:   35831.00 },
      { label: "Outside Service",      actual:   78091.14, budget:   80819.00 },
      { label: "NOI",                  actual: 1467410.07, budget: 1516772.50 },
      { label: "CapEx",                actual:   95055.81, budget:   85327.50 },
    ],
  },
  {
    propertyId: "oakleaf", year: 2026, quarter: "Q1",
    periodLabel: "Jan – Mar 2026",
    lines: [
      { label: "Total Income",        actual: 1451737.51, budget: 1451081.00 },
      { label: "Personnel",           actual:  142284.36, budget:  154361.00 },
      { label: "Repair & Maintenance", actual:   29497.81, budget:   32127.00 },
      { label: "Outside Service",      actual:   56879.68, budget:   77221.00 },
      { label: "NOI",                  actual:  734562.57, budget:  681981.00 },
      { label: "CapEx",                actual:  205593.35, budget:  226382.00 },
    ],
  },
  {
    propertyId: "oakview", year: 2026, quarter: "Q1",
    periodLabel: "Jan – Mar 2026",
    lines: [
      { label: "Total Income",        actual:  750759.01, budget:  882708.00 },
      { label: "Personnel",           actual:   88015.86, budget:   78834.00 },
      { label: "Repair & Maintenance", actual:   20103.90, budget:   19630.00 },
      { label: "Outside Service",      actual:   80830.95, budget:   53221.00 },
      { label: "NOI",                  actual:  274565.70, budget:  447842.00 },
      { label: "CapEx",                actual:   56201.79, budget:   44470.00 },
    ],
  },
  {
    propertyId: "pier5350", year: 2026, quarter: "Q1",
    periodLabel: "Jan – Mar 2026",
    lines: [
      { label: "Total Income",        actual: 1456089.94, budget: 1534544.00 },
      { label: "Personnel",           actual:  147689.86, budget:  183916.00 },
      { label: "Repair & Maintenance", actual:   30567.11, budget:   31663.00 },
      { label: "Outside Service",      actual:   78972.09, budget:   98345.00 },
      { label: "NOI",                  actual:  826402.29, budget:  668288.00 },
      { label: "CapEx",                actual:  145685.16, budget:   60430.00 },
    ],
  },
  {
    propertyId: "hendricks", year: 2026, quarter: "Q1",
    periodLabel: "Jan – Mar 2026",
    lines: [
      { label: "Total Income",        actual:  717667.13, budget:  724704.00 },
      { label: "Personnel",           actual:   66688.49, budget:   74866.00 },
      { label: "Repair & Maintenance", actual:    6225.42, budget:    6189.00 },
      { label: "Outside Service",      actual:   22907.90, budget:   24288.00 },
      { label: "NOI",                  actual:  356411.68, budget:  375824.00 },
      { label: "CapEx",                actual:    7900.98, budget:    6762.00 },
    ],
  },
];

// Helper: get data for a specific property + quarter
export function getDashboardData(year: number, quarter: string) {
  return properties.map((prop) => {
    const target = targets2026.find((t) => t.propertyId === prop.id && t.year === year && t.quarter === quarter) ?? null;
    const actual = actuals.find((a) => a.propertyId === prop.id && a.year === year && a.quarter === quarter) ?? null;
    const finding = findings.find((f) => f.propertyId === prop.id && f.year === year && f.quarter === quarter);
    const fins = financials.find((f) => f.propertyId === prop.id && f.year === year && f.quarter === quarter) ?? null;
    return { property: prop, target, actual, findings: finding?.bullets ?? [], financials: fins };
  });
}

export function getAvailableQuarters(year: number): string[] {
  const quarters = [...new Set(actuals.filter((a) => a.year === year).map((a) => a.quarter))];
  return quarters.sort();
}

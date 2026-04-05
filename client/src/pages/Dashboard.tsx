import { useState } from "react";
import { useRoute } from "wouter";
import Sidebar from "@/components/Sidebar";
import PropertyCard from "@/components/PropertyCard";
import { type Quarter } from "@/lib/utils";
import { getDashboardData, getAvailableQuarters, type Actual, type Target, type Property } from "@/data/portfolioData";

interface DashboardEntry {
  property: Property;
  target: Target | null;
  actual: Actual | null;
  findings: string[];
}

function SummaryRow({
  label,
  entries,
  getValue,
  getTarget,
  isPercent = false,
  lowerIsBetter = false,
}: {
  label: string;
  entries: DashboardEntry[];
  getValue: (e: DashboardEntry) => number | null;
  getTarget: (e: DashboardEntry) => number | null;
  isPercent?: boolean;
  lowerIsBetter?: boolean;
}) {
  const statusOf = (a: number | null, t: number | null) => {
    if (a == null || t == null) return "neutral";
    const r = a / t;
    if (!lowerIsBetter) { return r >= 1 ? "above" : r >= 0.8 ? "within" : "below"; }
    else { return r <= 1 ? "above" : r <= 1.2 ? "within" : "below"; }
  };
  const fmtV = (v: number | null) =>
    v == null ? "—" : isPercent ? (v * 100).toFixed(1) + "%" : v.toLocaleString();

  return (
    <tr className="border-b border-border/50 hover:bg-muted/20 transition-colors">
      <td className="py-2.5 pl-4 pr-2 font-medium text-foreground text-xs">{label}</td>
      {entries.map((e) => {
        const a = getValue(e);
        const t = getTarget(e);
        const s = statusOf(a, t);
        const cls = s === "above" ? "text-green-700 dark:text-green-400 font-semibold" :
          s === "within" ? "text-amber-600 dark:text-amber-400 font-semibold" :
          s === "below" ? "text-red-600 dark:text-red-400 font-semibold" : "text-muted-foreground";
        return (
          <td key={e.property.id} className={`py-2.5 px-3 text-right tabular-nums text-xs ${cls}`}>
            <div>{fmtV(a)}</div>
            <div className="text-[10px] text-muted-foreground font-normal">tgt {fmtV(t)}</div>
          </td>
        );
      })}
    </tr>
  );
}

export default function Dashboard() {
  const [, qParams] = useRoute("/q/:quarter");
  const availableQuarters = getAvailableQuarters(2026);
  const [activeQuarter, setActiveQuarter] = useState<Quarter>(
    (qParams?.quarter as Quarter) || (availableQuarters[0] as Quarter) || "Q1"
  );

  const dashData = getDashboardData(2026, activeQuarter);

  const portfolioOcc = (() => {
    const totalOccupied = dashData.reduce((s, e) => s + (e.actual?.occupiedUnits ?? 0), 0);
    const totalRentable = dashData.reduce((s, e) => s + (e.actual?.rentableUnits ?? 0), 0);
    return totalRentable > 0 ? totalOccupied / totalRentable : null;
  })();

  const allQuarters: Quarter[] = ["Q1", "Q2", "Q3", "Q4"];
  const periodLabel = dashData[0]?.actual?.periodLabel ?? "01/01/2026 – 03/31/2026";

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeQuarter={activeQuarter} onQuarterChange={setActiveQuarter} availableQuarters={availableQuarters} />

      <main className="flex-1 overflow-y-auto overscroll-contain">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">2026 Portfolio Performance</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {activeQuarter} Actuals vs. Targets · {periodLabel}
            </p>
          </div>

          <div className="flex items-center gap-6">
            {portfolioOcc != null && (
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Portfolio Occupancy</div>
                <div className="text-xl font-bold tabular-nums text-foreground">
                  {(portfolioOcc * 100).toFixed(2)}%
                </div>
              </div>
            )}
            <div className="flex gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                On/above target
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                Within 20%
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                Below target
              </div>
            </div>
          </div>
        </div>

        {/* Quarter tabs */}
        <div className="px-8 pt-5 pb-0 flex items-center gap-2">
          {allQuarters.map((q) => {
            const hasData = availableQuarters.includes(q);
            return (
              <button
                key={q}
                data-testid={`tab-quarter-${q}`}
                onClick={() => hasData && setActiveQuarter(q)}
                disabled={!hasData}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeQuarter === q
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : hasData
                    ? "bg-muted text-muted-foreground hover:bg-muted/80"
                    : "bg-muted/40 text-muted-foreground/40 cursor-not-allowed"
                }`}
              >
                {q} {!hasData && <span className="opacity-60">—</span>}
              </button>
            );
          })}
          <span className="ml-2 text-xs text-muted-foreground">
            {availableQuarters.length === 1 ? "Q2–Q4 unlocked when you drop the next Box Score" : ""}
          </span>
        </div>

        {/* Property grid */}
        <div className="px-8 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {dashData.map((entry) => (
              <PropertyCard
                key={entry.property.id}
                property={entry.property}
                target={entry.target}
                actual={entry.actual}
                quarter={activeQuarter}
              />
            ))}
          </div>
        </div>

        {/* Portfolio summary table */}
        <div className="px-8 pb-8">
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="px-5 py-3 border-b border-border bg-muted/30">
              <h2 className="text-sm font-semibold text-foreground">Portfolio Summary — {activeQuarter} 2026</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Actuals vs. quarterly and annual targets across all properties</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/30 border-b border-border text-muted-foreground">
                    <th className="text-left py-2.5 pl-4 pr-2 font-semibold w-36">Metric</th>
                    {dashData.map((e) => (
                      <th key={e.property.id} className="text-right py-2.5 px-3 font-semibold min-w-[110px]">
                        <div className="text-[11px] leading-tight">
                          {e.property.name.includes("Jordan") ? "Jordan I+II" :
                           e.property.name.includes("Oakleaf") ? "Oakleaf" :
                           e.property.name.includes("Oakview") ? "Oakview" :
                           e.property.name.includes("Pier") ? "Pier 5350" :
                           "Hendricks"}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <SummaryRow label="Occupancy" entries={dashData} getValue={(e) => e.actual?.occupancy ?? null} getTarget={(e) => e.target?.occupancyQTarget ?? null} isPercent />
                  <SummaryRow label="Total Leads" entries={dashData} getValue={(e) => e.actual?.totalLeads ?? null} getTarget={(e) => e.target?.totalLeadsQTarget ?? null} />
                  <SummaryRow label="Move-ins" entries={dashData} getValue={(e) => e.actual?.moveIns ?? null} getTarget={(e) => e.target?.moveInsQTarget ?? null} />
                  <SummaryRow label="Move-outs" entries={dashData} getValue={(e) => e.actual?.moveOuts ?? null} getTarget={(e) => e.target?.moveOutsQTarget ?? null} lowerIsBetter />
                  <SummaryRow label="Tour Rate" entries={dashData} getValue={(e) => e.actual?.tourRate ?? null} getTarget={(e) => e.target?.tourRateQTarget ?? null} isPercent />
                  <SummaryRow label="LTMI" entries={dashData} getValue={(e) => e.actual?.ltmi ?? null} getTarget={(e) => e.target?.ltmiQTarget ?? null} isPercent />
                  <SummaryRow label="Not-Ready Units" entries={dashData} getValue={(e) => e.actual?.notReady ?? null} getTarget={(e) => e.target?.notReadyQTarget ?? null} lowerIsBetter />
                  <SummaryRow label="Denial Rate" entries={dashData} getValue={(e) => e.actual?.denialRate ?? null} getTarget={(e) => e.target?.denialRateQTarget ?? null} isPercent lowerIsBetter />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

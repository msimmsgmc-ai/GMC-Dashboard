import { useState } from "react";
import { useRoute, Link } from "wouter";
import Sidebar from "@/components/Sidebar";
import MetricRow from "@/components/MetricRow";
import { ArrowLeft, AlertCircle, CheckCircle2, TrendingDown, Info } from "lucide-react";
import { fmtPct, fmt, getStatus, occStatusClass, type Quarter } from "@/lib/utils";
import { getDashboardData, getAvailableQuarters, type Actual, type Target, type Property } from "@/data/portfolioData";

interface DashboardEntry {
  property: Property;
  target: Target | null;
  actual: Actual | null;
  findings: string[];
}

export default function PropertyDetail() {
  const [, params] = useRoute("/property/:id/:quarter");
  const [, params2] = useRoute("/property/:id");
  const id = params?.id ?? params2?.id ?? "";
  const availableQuarters = getAvailableQuarters(2026);
  const [activeQuarter, setActiveQuarter] = useState<Quarter>(
    (params?.quarter as Quarter) || (availableQuarters[0] as Quarter) || "Q1"
  );

  const dashData = getDashboardData(2026, activeQuarter);
  const entry = dashData.find((e) => e.property.id === id);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar activeQuarter={activeQuarter} onQuarterChange={setActiveQuarter} availableQuarters={availableQuarters} />

      <main className="flex-1 overflow-y-auto overscroll-contain">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border px-8 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <a className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={13} />
                Portfolio
              </a>
            </Link>
            <span className="text-muted-foreground/40">/</span>
            {entry && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{entry.property.name}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {entry.property.classification}
                </span>
                <span className="text-xs text-muted-foreground">
                  {entry.property.units} units
                </span>
                {entry.property.isNew && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">New acquisition</span>
                )}
              </div>
            )}
          </div>
        </div>

        {!entry ? (
          <div className="px-8 py-12 text-center text-muted-foreground">Property not found.</div>
        ) : (
          <div className="px-8 py-6 space-y-6">
            <OccupancyHero entry={entry} quarter={activeQuarter} />
            <MetricsTable entry={entry} quarter={activeQuarter} />
            {entry.findings.length > 0 && (
              <FindingsCard findings={entry.findings} propertyName={entry.property.name} quarter={activeQuarter} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function OccupancyHero({ entry, quarter }: { entry: DashboardEntry; quarter: Quarter }) {
  const { actual, target } = entry;
  const occ = actual?.occupancy ?? null;
  const occTarget = target?.occupancyQTarget ?? null;
  const occYr = target?.occupancyYearTarget ?? null;
  const cls = occStatusClass(occ, occTarget);
  const status = getStatus(occ, occTarget);

  const cfgMap = {
    above: { label: "On Target", Icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" },
    within: { label: "Within 20%", Icon: AlertCircle, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800" },
    below: { label: "Below Target", Icon: TrendingDown, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" },
    neutral: { label: "No Target", Icon: Info, color: "text-muted-foreground", bg: "bg-muted border-border" },
  };
  const { label, Icon, color, bg } = cfgMap[status];

  return (
    <div className={`border rounded-xl p-6 ${bg}`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Occupancy Rate — {quarter} 2026
          </div>
          <div className={`text-5xl font-bold tabular-nums leading-none ${cls}`}>
            {occ != null ? (occ * 100).toFixed(2) + "%" : "—"}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span>Q Target: <strong className="text-foreground">{fmtPct(occTarget)}</strong></span>
            <span>Year Target: <strong className="text-foreground">{fmtPct(occYr)}</strong></span>
            {actual?.occupancyStart != null && (
              <span>Start of Year: <strong className="text-foreground">{fmtPct(actual.occupancyStart)}</strong></span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Icon size={18} className={color} />
          <span className={`text-sm font-semibold ${color}`}>{label}</span>
        </div>
      </div>

      {occ != null && (
        <div className="mt-4">
          <div className="h-2 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                status === "above" ? "bg-green-500" :
                status === "within" ? "bg-amber-400" : "bg-red-500"
              }`}
              style={{ width: `${Math.min(occ * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>0%</span><span>50%</span><span>100%</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mt-4">
        {[
          { label: "Rentable", value: fmt(actual?.rentableUnits) },
          { label: "Occupied", value: fmt(actual?.occupiedUnits) },
          { label: "Vacant", value: fmt(actual?.vacantUnits) },
          { label: "Not-Ready", value: fmt(actual?.notReady) },
          { label: "Move-ins", value: fmt(actual?.moveIns) },
          { label: "Move-outs", value: fmt(actual?.moveOuts) },
        ].map(({ label, value }) => (
          <div key={label} className="text-center">
            <div className="text-lg font-bold tabular-nums text-foreground">{value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricsTable({ entry, quarter }: { entry: DashboardEntry; quarter: Quarter }) {
  const { actual, target } = entry;
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold">Metrics vs. Targets</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {quarter} actuals compared to quarterly and annual targets
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground bg-muted/20">
              <th className="text-left py-2.5 pl-4 pr-2 font-semibold w-44">Metric</th>
              <th className="text-right py-2.5 px-2 font-semibold w-20">2025 Actual</th>
              <th className="text-right py-2.5 px-2 font-semibold w-24">{quarter} Actual</th>
              <th className="text-right py-2.5 px-2 font-semibold w-20">{quarter} Target</th>
              <th className="text-right py-2.5 px-2 font-semibold w-20">Year Target</th>
              <th className="py-2.5 px-3 w-40">Progress</th>
            </tr>
          </thead>
          <tbody>
            <MetricRow label="Total Leads" actual={actual?.totalLeads} target={target?.totalLeadsQTarget} yearTarget={target?.totalLeadsYearTarget} start={actual?.totalLeadsStart ?? null} />
            <MetricRow label="Move-ins" actual={actual?.moveIns} target={target?.moveInsQTarget} yearTarget={target?.moveInsYearTarget} start={actual?.moveInsStart ?? null} />
            <MetricRow label="Move-outs" actual={actual?.moveOuts} target={target?.moveOutsQTarget} yearTarget={target?.moveOutsYearTarget} start={actual?.moveOutsStart ?? null} lowerIsBetter />
            <MetricRow label="Tour Rate" actual={actual?.tourRate} target={target?.tourRateQTarget} yearTarget={target?.tourRateYearTarget} start={actual?.tourRateStart} isPercent />
            <MetricRow label="LTMI" actual={actual?.ltmi} target={target?.ltmiQTarget} yearTarget={target?.ltmiYearTarget} start={actual?.ltmiStart} isPercent note="move-ins / leads" />
            <MetricRow label="Not-Ready Units" actual={actual?.notReady} target={target?.notReadyQTarget} yearTarget={target?.notReadyYearTarget} start={actual?.notReadyStart} lowerIsBetter note="3.5% of total" />
            <MetricRow label="Denial Rate" actual={actual?.denialRate} target={target?.denialRateQTarget} yearTarget={target?.denialRateYearTarget} start={actual?.denialRateStart} isPercent lowerIsBetter />
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-border bg-muted/20 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" />On/above target</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-400" />Within 20%</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" />Below target</div>
        <div className="ml-auto">Bar shows actual vs. target tick mark · Move-outs & not-ready: lower is better</div>
      </div>
    </div>
  );
}

function FindingsCard({ findings, propertyName, quarter }: { findings: string[]; propertyName: string; quarter: Quarter }) {
  const isAlert = (b: string) =>
    b.toLowerCase().includes("crisis") || b.toLowerCase().includes("emergency") || b.toLowerCase().includes("urgent");

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-border bg-muted/30">
        <h2 className="text-sm font-semibold">Key Findings & Action Items</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{propertyName} · {quarter} 2026</p>
      </div>
      <div className="px-5 py-4 space-y-3">
        {findings.map((bullet, i) => (
          <div key={i} className={`flex gap-3 p-3 rounded-lg text-sm leading-relaxed ${
            isAlert(bullet)
              ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
              : "bg-muted/40"
          }`}>
            <div className={`shrink-0 mt-0.5 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center ${
              isAlert(bullet) ? "bg-red-500 text-white" : "bg-primary/10 text-primary"
            }`}>{i + 1}</div>
            <p>{bullet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

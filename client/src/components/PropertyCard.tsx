import { Link } from "wouter";
import { ArrowRight, AlertTriangle, CheckCircle2, TrendingDown } from "lucide-react";
import { fmtPct, getStatus, occStatusClass, type Quarter } from "@/lib/utils";
import type { Property, Actual, Target as StaticTarget } from "@/data/portfolioData";

interface Props {
  property: Property;
  target: StaticTarget | null;
  actual: Actual | null;
  quarter: Quarter;
}

function OccupancyGauge({ value, target, yrTarget }: { value: number | null, target: number | null, yrTarget: number | null }) {
  const cls = occStatusClass(value, target);
  const status = getStatus(value, target);

  return (
    <div className="text-center">
      <div className={`text-3xl font-bold tabular-nums leading-none ${cls}`}>
        {value != null ? (value * 100).toFixed(2) + "%" : "—"}
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Q Target: {fmtPct(target)} · Yr Target: {fmtPct(yrTarget)}
      </div>
      {/* Mini progress bar */}
      {value != null && target != null && (
        <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              status === "above" ? "bg-green-500" :
              status === "within" ? "bg-amber-400" : "bg-red-500"
            }`}
            style={{ width: `${Math.min(value * 100, 100)}%` }}
          />
  
        </div>
      )}
    </div>
  );
}

function StatusIcon({ actual, target, lowerIsBetter = false }: { actual: number | null, target: number | null, lowerIsBetter?: boolean }) {
  const s = getStatus(actual, target, !lowerIsBetter);
  if (s === "above") return <CheckCircle2 size={12} className="text-green-600 dark:text-green-400 shrink-0" />;
  if (s === "within") return <AlertTriangle size={12} className="text-amber-500 shrink-0" />;
  if (s === "below") return <TrendingDown size={12} className="text-red-600 dark:text-red-400 shrink-0" />;
  return null;
}

export default function PropertyCard({ property, target, actual, quarter }: Props) {
  const occTarget = target?.occupancyQTarget ?? null;
  const occYrTarget = target?.occupancyYearTarget ?? null;

  // Alert count — how many metrics are "below"
  const metricsToCheck = [
    { a: actual?.totalLeads, t: target?.totalLeadsQTarget, lb: false },
    { a: actual?.moveIns, t: target?.moveInsQTarget, lb: false },
    { a: actual?.moveOuts, t: target?.moveOutsQTarget, lb: true },
    { a: actual?.tourRate, t: target?.tourRateQTarget, lb: false },
    { a: actual?.ltmi, t: target?.ltmiQTarget, lb: false },
    { a: actual?.notReady, t: target?.notReadyQTarget, lb: true },
    { a: actual?.denialRate, t: target?.denialRateQTarget, lb: true },
  ];
  const alerts = metricsToCheck.filter(m => getStatus(m.a, m.t, !m.lb) === "below").length;
  const onTarget = metricsToCheck.filter(m => getStatus(m.a, m.t, !m.lb) === "above").length;

  return (
    <Link href={`/property/${property.id}/${quarter}`}>
      <a
        data-testid={`property-card-${property.id}`}
        className="block bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="font-semibold text-sm text-foreground leading-tight">{property.name}</div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-muted-foreground">{property.classification}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{property.units.toLocaleString()} units</span>
              {property.isNew && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">New</span>
              )}
            </div>
          </div>
          <ArrowRight size={15} className="text-muted-foreground group-hover:text-primary transition-colors mt-0.5 shrink-0" />
        </div>

        {/* Occupancy */}
        <div className="mb-4">
          <OccupancyGauge value={actual?.occupancy ?? null} target={occTarget} yrTarget={occYrTarget} />
        </div>

        {/* Quick metrics row */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-2">
            <StatusIcon actual={actual?.totalLeads} target={target?.totalLeadsQTarget} />
            <div>
              <div className="text-muted-foreground">Leads</div>
              <div className="font-semibold tabular-nums">
                {actual?.totalLeads?.toLocaleString() ?? "—"}
                <span className="font-normal text-muted-foreground"> / {target?.totalLeadsQTarget?.toLocaleString() ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-2">
            <StatusIcon actual={actual?.moveIns} target={target?.moveInsQTarget} />
            <div>
              <div className="text-muted-foreground">Move-ins</div>
              <div className="font-semibold tabular-nums">
                {actual?.moveIns ?? "—"}
                <span className="font-normal text-muted-foreground"> / {target?.moveInsQTarget ?? "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-2">
            <StatusIcon actual={actual?.denialRate} target={target?.denialRateQTarget} lowerIsBetter />
            <div>
              <div className="text-muted-foreground">Denial Rate</div>
              <div className="font-semibold tabular-nums">
                {actual?.denialRate != null ? fmtPct(actual.denialRate) : "—"}
                <span className="font-normal text-muted-foreground"> tgt {fmtPct(target?.denialRateQTarget)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-muted/40 rounded-lg px-2.5 py-2">
            <StatusIcon actual={actual?.notReady} target={target?.notReadyQTarget} lowerIsBetter />
            <div>
              <div className="text-muted-foreground">Not-Ready</div>
              <div className="font-semibold tabular-nums">
                {actual?.notReady ?? "—"}
                <span className="font-normal text-muted-foreground"> / {target?.notReadyQTarget ?? "—"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-green-600 dark:text-green-400 font-medium">{onTarget} on target</span>
            {alerts > 0 && (
              <span className="text-red-600 dark:text-red-400 font-medium">{alerts} below</span>
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">{quarter} 2026</span>
        </div>
      </a>
    </Link>
  );
}

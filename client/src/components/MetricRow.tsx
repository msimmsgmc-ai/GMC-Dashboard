import { getStatus, statusClass, fmtPct, fmt } from "@/lib/utils";

interface MetricRowProps {
  label: string;
  actual: number | null | undefined;
  target: number | null | undefined;
  yearTarget?: number | null | undefined;
  start?: number | null | undefined;
  isPercent?: boolean;
  lowerIsBetter?: boolean;
  note?: string;
}

function BarViz({
  actual,
  target,
  lowerIsBetter = false,
  isPercent = false,
}: {
  actual: number | null | undefined;
  target: number | null | undefined;
  lowerIsBetter?: boolean;
  isPercent?: boolean;
}) {
  if (actual == null || target == null) return null;
  const max = lowerIsBetter
    ? Math.max(actual, target) * 1.3
    : Math.max(actual, target) * 1.2;
  const status = getStatus(actual, target, !lowerIsBetter);
  const colorMap = {
    above: "bg-green-500 dark:bg-green-400",
    within: "bg-amber-400",
    below: "bg-red-500 dark:bg-red-400",
    neutral: "bg-gray-400",
  };
  const tgtPct = Math.min((target / max) * 100, 100);
  const actPct = Math.min((actual / max) * 100, 100);

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Actual bar */}
      <div className="metric-bar flex-1 relative overflow-hidden">
        <div
          className={`metric-bar-fill ${colorMap[status]}`}
          style={{ width: `${actPct}%` }}
        />
        {/* Target tick — clipped to bar height */}
        <div
          className="absolute inset-y-0 w-0.5 bg-foreground/40"
          style={{ left: `${tgtPct}%` }}
          title={`Target: ${isPercent ? fmtPct(target) : fmt(target)}`}
        />
      </div>
    </div>
  );
}

export default function MetricRow({
  label,
  actual,
  target,
  yearTarget,
  start,
  isPercent = false,
  lowerIsBetter = false,
  note,
}: MetricRowProps) {
  const status = getStatus(actual, target, !lowerIsBetter);
  const sc = statusClass(status);
  const display = isPercent ? fmtPct(actual) : fmt(actual);
  const tgtDisplay = isPercent ? fmtPct(target) : fmt(target);
  const yrDisplay = isPercent ? fmtPct(yearTarget) : fmt(yearTarget);
  const startDisplay = start != null ? (isPercent ? fmtPct(start) : fmt(start)) : null;

  return (
    <tr className="group border-b border-border/50 hover:bg-muted/30 transition-colors">
      <td className="py-2.5 pl-4 pr-2 text-sm font-medium text-foreground w-44">
        <div className="flex items-center gap-1.5">
          {label}
          {lowerIsBetter && (
            <span className="text-[9px] text-muted-foreground font-normal">↓ better</span>
          )}
        </div>
        {note && <div className="text-[10px] text-muted-foreground">{note}</div>}
      </td>

      {/* Start of year */}
      <td className="py-2.5 px-2 text-right tabular-nums text-sm text-muted-foreground w-20">
        {startDisplay ?? "—"}
      </td>

      {/* Actual */}
      <td className="py-2.5 px-2 text-right tabular-nums text-sm font-semibold w-20">
        <span className={`${sc} px-1.5 py-0.5 rounded text-xs`}>
          {display}
        </span>
      </td>

      {/* Q Target */}
      <td className="py-2.5 px-2 text-right tabular-nums text-sm text-muted-foreground w-20">
        {tgtDisplay}
      </td>

      {/* Year Target */}
      <td className="py-2.5 px-2 text-right tabular-nums text-sm text-muted-foreground w-20">
        {yrDisplay}
      </td>

      {/* Bar viz */}
      <td className="py-2.5 px-3 w-40">
        <BarViz
          actual={actual}
          target={target}
          lowerIsBetter={lowerIsBetter}
          isPercent={isPercent}
        />
      </td>
    </tr>
  );
}

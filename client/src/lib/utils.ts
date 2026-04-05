import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fmt(value: number | null | undefined, decimals = 0): string {
  if (value == null) return "—";
  return value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function fmtPct(value: number | null | undefined, decimals = 1): string {
  if (value == null) return "—";
  return (value * 100).toFixed(decimals) + "%";
}

export type StatusLevel = "above" | "within" | "below" | "neutral";

/** Determine status for a metric vs its target.
 *  higherIsBetter: true → above target is green, below is red
 *  withinPct: fraction tolerance before "within" (default 20%)
 */
export function getStatus(
  actual: number | null | undefined,
  target: number | null | undefined,
  higherIsBetter = true,
  withinPct = 0.20
): StatusLevel {
  if (actual == null || target == null) return "neutral";
  const ratio = actual / target;
  if (higherIsBetter) {
    if (ratio >= 1.0) return "above";
    if (ratio >= (1 - withinPct)) return "within";
    return "below";
  } else {
    // lower is better (move-outs, not-ready, denial rate)
    if (ratio <= 1.0) return "above";        // at or below target → good
    if (ratio <= (1 + withinPct)) return "within";
    return "below";
  }
}

export function statusClass(status: StatusLevel): string {
  switch (status) {
    case "above": return "status-above";
    case "within": return "status-within";
    case "below": return "status-below";
    default: return "status-neutral";
  }
}

export function statusLabel(status: StatusLevel): string {
  switch (status) {
    case "above": return "On Target";
    case "within": return "Within 20%";
    case "below": return "Below Target";
    default: return "No Target";
  }
}

export function occStatusClass(actual: number | null | undefined, target: number | null | undefined): string {
  const s = getStatus(actual, target);
  switch (s) {
    case "above": return "occ-above";
    case "within": return "occ-within";
    case "below": return "occ-below";
    default: return "text-muted-foreground";
  }
}

export const QUARTERS = ["Q1", "Q2", "Q3", "Q4"] as const;
export type Quarter = typeof QUARTERS[number];

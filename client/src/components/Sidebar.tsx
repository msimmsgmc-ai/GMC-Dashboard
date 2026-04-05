import { Link, useLocation } from "wouter";
import { BarChart3, Building2, TrendingUp, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { QUARTERS, type Quarter } from "@/lib/utils";

interface SidebarProps {
  activeQuarter: Quarter;
  onQuarterChange: (q: Quarter) => void;
  availableQuarters?: string[];
}

export default function Sidebar({ activeQuarter, onQuarterChange, availableQuarters = ["Q1"] }: SidebarProps) {
  const [location] = useLocation();
  const [dark, setDark] = useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const isActive = (path: string) => location === path || location.startsWith(path + "/");

  return (
    <aside className="sidebar w-56 flex flex-col h-screen overflow-y-auto overscroll-contain shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2.5">
          {/* SVG Logo — minimal building mark */}
          <svg
            aria-label="Portfolio Dashboard"
            viewBox="0 0 32 32"
            fill="none"
            className="w-7 h-7 shrink-0"
          >
            <rect x="2" y="18" width="6" height="12" fill="hsl(var(--sidebar-accent))" rx="1" />
            <rect x="10" y="10" width="6" height="20" fill="hsl(var(--sidebar-accent))" opacity="0.8" rx="1" />
            <rect x="18" y="14" width="6" height="16" fill="hsl(var(--sidebar-accent))" opacity="0.6" rx="1" />
            <rect x="26" y="6" width="4" height="24" fill="hsl(var(--sidebar-accent))" opacity="0.4" rx="1" />
          </svg>
          <div>
            <div className="text-[11px] font-semibold tracking-widest uppercase text-[hsl(var(--sidebar-accent))]">Portfolio</div>
            <div className="text-[13px] font-semibold text-[hsl(var(--sidebar-fg))] leading-tight">Performance</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--sidebar-muted))] px-2 mb-2">
          2026 Dashboard
        </div>

        {/* Quarter tabs */}
        {QUARTERS.map((q) => {
          const hasData = availableQuarters.includes(q);
          return (
            <button
              key={q}
              data-testid={`sidebar-quarter-${q}`}
              onClick={() => hasData && onQuarterChange(q)}
              disabled={!hasData}
              className={`sidebar-item w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeQuarter === q && hasData ? "active" : ""
              } ${!hasData ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
            >
              <span className="flex items-center gap-2">
                <BarChart3 size={14} />
                {q} Actuals
              </span>
              {!hasData && (
                <span className="text-[10px] text-[hsl(var(--sidebar-muted))]">Pending</span>
              )}
              {q === "Q1" && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--sidebar-accent))/0.2] text-[hsl(var(--sidebar-accent))]">Live</span>
              )}
            </button>
          );
        })}

        <div className="text-[10px] font-semibold uppercase tracking-widest text-[hsl(var(--sidebar-muted))] px-2 mt-5 mb-2">
          Properties
        </div>

        <Link href="/">
          <a
            data-testid="sidebar-portfolio-overview"
            className={`sidebar-item flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
              location === "/" || location.startsWith("/q/") ? "active" : ""
            }`}
          >
            <TrendingUp size={14} />
            Portfolio Overview
          </a>
        </Link>

        {[
          { id: "jordan_station", label: "Jordan Station I+II" },
          { id: "oakleaf", label: "Oakleaf Village" },
          { id: "oakview", label: "Oakview Landing" },
          { id: "pier5350", label: "Pier 5350" },
          { id: "hendricks", label: "Hendricks" },
        ].map(({ id, label }) => (
          <Link key={id} href={`/property/${id}/${activeQuarter}`}>
            <a
              data-testid={`sidebar-property-${id}`}
              className={`sidebar-item flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                isActive(`/property/${id}`) ? "active" : ""
              }`}
            >
              <Building2 size={13} />
              <span className="truncate">{label}</span>
            </a>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-[hsl(var(--sidebar-border))] flex items-center justify-between">
        <span className="text-[11px] text-[hsl(var(--sidebar-muted))]">Confidential</span>
        <button
          data-testid="theme-toggle"
          onClick={() => setDark((d) => !d)}
          className="p-1.5 rounded hover:bg-[hsl(var(--sidebar-border))] text-[hsl(var(--sidebar-muted))] hover:text-[hsl(var(--sidebar-fg))] transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </aside>
  );
}

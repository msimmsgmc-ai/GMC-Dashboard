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
      <div className="px-4 py-4 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3">
          {/* GMC Properties logo mark — house on road in circular frame */}
          <svg
            aria-label="GMC Properties"
            viewBox="0 0 44 44"
            fill="none"
            className="w-9 h-9 shrink-0"
          >
            {/* Outer circle — navy */}
            <circle cx="22" cy="22" r="21" fill="#091426" />
            {/* Inner circle — teal dome */}
            <circle cx="22" cy="20" r="14" fill="#417780" />
            {/* Road / path — olive green */}
            <path d="M14 34 Q18 26 22 24 Q26 26 30 34 Q26 32 22 32 Q18 32 14 34Z" fill="#a4b259" />
            {/* House shape — white */}
            <polygon points="22,10 15,17 15,24 29,24 29,17" fill="white" opacity="0.92" />
            {/* Door */}
            <rect x="20" y="19" width="4" height="5" fill="#417780" rx="0.5" />
            {/* Roof ridge line */}
            <polyline points="14,17 22,10 30,17" fill="none" stroke="white" strokeWidth="1.2" opacity="0.6" />
          </svg>
          <div>
            <div className="text-[15px] font-bold tracking-wide text-white leading-tight">GMC</div>
            <div className="text-[10px] font-semibold tracking-widest uppercase text-[hsl(var(--sidebar-accent))] leading-tight">Properties</div>
            <div className="text-[9px] text-[hsl(var(--sidebar-muted))] leading-tight mt-0.5">Performance Dashboard</div>
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
              {q === "Q1" && hasData && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--sidebar-accent))/0.2] text-[hsl(var(--sidebar-accent))]">Live</span>
              )}
              {q === "Q2" && hasData && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[hsl(var(--sidebar-accent))/0.2] text-[hsl(var(--sidebar-accent))]">Partial</span>
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

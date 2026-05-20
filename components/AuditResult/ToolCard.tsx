"use client";

import { ToolAudit, TOOL_DISPLAY_NAMES } from "@/lib/audit-engine/types";
import { formatCurrency } from "@/lib/utils";

interface ToolCardProps {
  audit: ToolAudit;
  inputPlan: string;
  inputSeats: number;
}

export function ToolCard({ audit, inputPlan, inputSeats }: ToolCardProps) {
  const {
    toolId,
    currentMonthlySpend,
    recommendedAction,
    projectedMonthlySpend,
    monthlySavings,
    reason,
  } = audit;

  const displayName = TOOL_DISPLAY_NAMES[toolId] || toolId;

  // Render Action Badges
  const renderActionBadge = () => {
    switch (recommendedAction) {
      case "downgrade_plan":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-overspend-950/50 text-overspend-300 border border-overspend-800/40">
            Downgrade Plan
          </span>
        );
      case "reduce_seats":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-overspend-950/50 text-overspend-300 border border-overspend-800/40">
            Reduce Seats
          </span>
        );
      case "switch_tool":
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-credex-950/50 text-credex-300 border border-credex-800/40">
            Consolidate / Switch
          </span>
        );
      case "already_optimal":
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-savings-950/50 text-savings-300 border border-savings-800/45">
            Optimal
          </span>
        );
    }
  };

  const isOptimal = recommendedAction === "already_optimal";

  return (
    <div
      className={`glass-card p-5 transition-all duration-300 ${
        isOptimal
          ? "border-navy-700/35 opacity-90"
          : "border-overspend-800/30 hover:border-overspend-700/50 shadow-md shadow-overspend-950/5"
      }`}
      id={`tool-card-${toolId}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-lg font-bold text-navy-100 flex items-center gap-2">
            {displayName}
            <span className="text-xs font-normal text-navy-400">
              ({inputPlan} • {inputSeats} {inputSeats === 1 ? "seat" : "seats"})
            </span>
          </h3>
        </div>
        {renderActionBadge()}
      </div>

      {/* Financials Grid */}
      <div className="grid grid-cols-3 gap-2 bg-navy-950/40 rounded-xl p-3 mb-4 border border-navy-900/50">
        <div>
          <span className="block text-[10px] uppercase font-bold tracking-wider text-navy-500 mb-0.5">
            Current Spend
          </span>
          <span className="text-sm font-semibold text-navy-300">
            {formatCurrency(currentMonthlySpend)}/mo
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold tracking-wider text-navy-500 mb-0.5">
            Recommended
          </span>
          <span
            className={`text-sm font-semibold ${
              isOptimal ? "text-navy-300" : "text-savings-400"
            }`}
          >
            {formatCurrency(projectedMonthlySpend)}/mo
          </span>
        </div>
        <div>
          <span className="block text-[10px] uppercase font-bold tracking-wider text-navy-500 mb-0.5">
            Monthly Savings
          </span>
          <span
            className={`text-sm font-bold ${
              isOptimal ? "text-navy-400" : "text-savings-400"
            }`}
          >
            {isOptimal ? "$0" : `${formatCurrency(monthlySavings)}/mo`}
          </span>
        </div>
      </div>

      {/* Recommendation Reason */}
      <div className="flex items-start gap-2.5 text-xs text-navy-200">
        {!isOptimal ? (
          <svg
            className="w-4 h-4 text-overspend-400 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4 text-savings-400 mt-0.5 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <p className="leading-relaxed font-medium">{reason}</p>
      </div>
    </div>
  );
}

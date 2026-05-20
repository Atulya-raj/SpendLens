"use client";

import { ToolId, TOOL_DISPLAY_NAMES, TOOL_PLANS } from "@/lib/audit-engine/types";

interface ToolRowProps {
  index: number;
  toolId: ToolId;
  plan: string;
  seats: number;
  monthlySpend: number;
  onUpdate: (index: number, field: string, value: string | number) => void;
  onRemove: (index: number) => void;
  usedToolIds: ToolId[];
}

const ALL_TOOL_IDS: ToolId[] = [
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
];

export function ToolRow({
  index,
  toolId,
  plan,
  seats,
  monthlySpend,
  onUpdate,
  onRemove,
  usedToolIds,
}: ToolRowProps) {
  const availableTools = ALL_TOOL_IDS.filter(
    (id) => id === toolId || !usedToolIds.includes(id)
  );
  const plans = TOOL_PLANS[toolId] || [];

  return (
    <div className="glass-card p-4 sm:p-5 space-y-4 transition-all duration-300 hover:border-navy-400/30">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-navy-300">
          Tool #{index + 1}
        </span>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-navy-400 hover:text-overspend-400 transition-colors text-sm flex items-center gap-1 cursor-pointer"
          aria-label={`Remove tool ${index + 1}`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Tool Selector */}
        <div>
          <label className="block text-xs text-navy-400 mb-1.5 font-medium uppercase tracking-wider">
            Tool
          </label>
          <select
            value={toolId}
            onChange={(e) => {
              const newToolId = e.target.value as ToolId;
              onUpdate(index, "toolId", newToolId);
              // Reset plan to first available
              const newPlans = TOOL_PLANS[newToolId] || [];
              if (newPlans.length > 0) {
                onUpdate(index, "plan", newPlans[0]);
              }
            }}
            className="w-full bg-navy-800/80 border border-navy-600/40 rounded-lg px-3 py-2.5 text-navy-100 text-sm focus:border-credex-500 focus:ring-1 focus:ring-credex-500 transition-colors appearance-none cursor-pointer"
            id={`tool-select-${index}`}
          >
            {availableTools.map((id) => (
              <option key={id} value={id}>
                {TOOL_DISPLAY_NAMES[id]}
              </option>
            ))}
          </select>
        </div>

        {/* Plan Selector */}
        <div>
          <label className="block text-xs text-navy-400 mb-1.5 font-medium uppercase tracking-wider">
            Plan
          </label>
          <select
            value={plan}
            onChange={(e) => onUpdate(index, "plan", e.target.value)}
            className="w-full bg-navy-800/80 border border-navy-600/40 rounded-lg px-3 py-2.5 text-navy-100 text-sm focus:border-credex-500 focus:ring-1 focus:ring-credex-500 transition-colors appearance-none cursor-pointer"
            id={`plan-select-${index}`}
          >
            {plans.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Seats */}
        <div>
          <label className="block text-xs text-navy-400 mb-1.5 font-medium uppercase tracking-wider">
            Seats
          </label>
          <input
            type="number"
            min={1}
            max={10000}
            value={seats}
            onChange={(e) => onUpdate(index, "seats", parseInt(e.target.value) || 1)}
            className="w-full bg-navy-800/80 border border-navy-600/40 rounded-lg px-3 py-2.5 text-navy-100 text-sm focus:border-credex-500 focus:ring-1 focus:ring-credex-500 transition-colors"
            id={`seats-input-${index}`}
          />
        </div>

        {/* Monthly Spend */}
        <div>
          <label className="block text-xs text-navy-400 mb-1.5 font-medium uppercase tracking-wider">
            Monthly Spend ($)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400 text-sm">$</span>
            <input
              type="number"
              min={0}
              step={1}
              value={monthlySpend}
              onChange={(e) => onUpdate(index, "monthlySpend", parseFloat(e.target.value) || 0)}
              className="w-full bg-navy-800/80 border border-navy-600/40 rounded-lg pl-7 pr-3 py-2.5 text-navy-100 text-sm focus:border-credex-500 focus:ring-1 focus:ring-credex-500 transition-colors"
              id={`spend-input-${index}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

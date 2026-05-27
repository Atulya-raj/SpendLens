"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ToolRow } from "./ToolRow";
import { useFormPersist } from "./useFormPersist";
import { ToolId, UseCase, TOOL_PLANS } from "@/lib/audit-engine/types";

interface ToolFormData {
  toolId: ToolId;
  plan: string;
  seats: number;
  monthlySpend: number;
}

interface FormState {
  tools: ToolFormData[];
  teamSize: number;
  useCase: UseCase;
  currency: "USD" | "INR";
}

const DEFAULT_TOOL: ToolFormData = {
  toolId: "cursor",
  plan: "Pro",
  seats: 1,
  monthlySpend: 20,
};

const INITIAL_STATE: FormState = {
  tools: [{ ...DEFAULT_TOOL }],
  teamSize: 5,
  useCase: "coding",
  currency: "USD",
};

const USE_CASE_OPTIONS: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "data", label: "Data Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / All" },
];

export function SpendForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamSizeStr, setTeamSizeStr] = useState(String(INITIAL_STATE.teamSize));

  const { clearForm } = useFormPersist(formState, setFormState);

  const usedToolIds = formState.tools.map((t) => t.toolId);

  const handleCurrencyChange = useCallback((newCurrency: "USD" | "INR") => {
    if (newCurrency === formState.currency) return;

    const rate = 95.78;
    setFormState((prev) => {
      const convertedTools = prev.tools.map((tool) => {
        let newSpend = tool.monthlySpend;
        if (newCurrency === "INR") {
          newSpend = Math.round(tool.monthlySpend * rate);
        } else {
          newSpend = Math.round(tool.monthlySpend / rate);
        }
        return {
          ...tool,
          monthlySpend: newSpend,
        };
      });

      return {
        ...prev,
        currency: newCurrency,
        tools: convertedTools,
      };
    });
  }, [formState.currency]);

  const addTool = useCallback(() => {
    const allTools: ToolId[] = [
      "cursor", "github-copilot", "claude", "chatgpt",
      "anthropic-api", "openai-api", "gemini", "windsurf",
    ];
    const available = allTools.filter((id) => !usedToolIds.includes(id));
    if (available.length === 0) return;

    const newToolId = available[0];
    const plans = TOOL_PLANS[newToolId] || [];

    setFormState((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        {
          toolId: newToolId,
          plan: plans[0] || "",
          seats: 1,
          monthlySpend: 0,
        },
      ],
    }));
  }, [usedToolIds]);

  const removeTool = useCallback((index: number) => {
    setFormState((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  }, []);

  const updateTool = useCallback(
    (index: number, field: string, value: string | number) => {
      setFormState((prev) => ({
        ...prev,
        tools: prev.tools.map((tool, i) =>
          i === index ? { ...tool, [field]: value } : tool
        ),
      }));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools: formState.tools,
          teamSize: formState.teamSize,
          useCase: formState.useCase,
          currency: formState.currency,
          honeypot: (document.getElementById("website-hp") as HTMLInputElement)?.value || "",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Audit failed");
      }

      const data = await response.json();
      clearForm();
      router.push(`/audit/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormState(INITIAL_STATE);
    setTeamSizeStr(String(INITIAL_STATE.teamSize));
    clearForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" id="audit-form">
      {/* Honeypot field - hidden from users, visible to bots */}
      <input
        type="text"
        name="website"
        id="website-hp"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Tools Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-navy-100">
            Your AI Tools
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-navy-800/80 border border-navy-600/40 rounded-lg p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleCurrencyChange("USD")}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  formState.currency === "USD"
                    ? "bg-credex-600 text-white"
                    : "text-navy-300 hover:text-navy-100"
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => handleCurrencyChange("INR")}
                className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                  formState.currency === "INR"
                    ? "bg-credex-600 text-white"
                    : "text-navy-300 hover:text-navy-100"
                }`}
              >
                INR (₹)
              </button>
            </div>
            <span className="text-xs text-navy-400">
              {formState.tools.length} / 8 tools
            </span>
          </div>
        </div>

        {formState.tools.map((tool, index) => (
          <ToolRow
            key={`${tool.toolId}-${index}`}
            index={index}
            toolId={tool.toolId}
            plan={tool.plan}
            seats={tool.seats}
            monthlySpend={tool.monthlySpend}
            currency={formState.currency}
            onUpdate={updateTool}
            onRemove={removeTool}
            usedToolIds={usedToolIds}
          />
        ))}

        {formState.tools.length < 8 && (
          <button
            type="button"
            onClick={addTool}
            className="w-full py-3 border-2 border-dashed border-navy-600/50 rounded-xl text-navy-300 hover:text-navy-100 hover:border-credex-500/50 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 cursor-pointer"
            id="add-tool-btn"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Tool
          </button>
        )}
      </div>

      {/* Team Config */}
      <div className="glass-card p-4 sm:p-5 space-y-4">
        <h3 className="text-lg font-semibold text-navy-100">Team Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="team-size"
              className="block text-xs text-navy-400 mb-1.5 font-medium uppercase tracking-wider"
            >
              Team Size
            </label>
            <input
              id="team-size"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={teamSizeStr}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || /^\d+$/.test(val)) {
                  setTeamSizeStr(val);
                }
              }}
              onBlur={() => {
                const parsed = parseInt(teamSizeStr);
                const final = isNaN(parsed) || parsed < 1 ? 1 : parsed;
                setTeamSizeStr(String(final));
                setFormState((prev) => ({
                  ...prev,
                  teamSize: final,
                }));
              }}
              className="w-full bg-navy-800/80 border border-navy-600/40 rounded-lg px-3 py-2.5 text-navy-100 text-base sm:text-sm focus:border-credex-500 focus:ring-1 focus:ring-credex-500 transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="use-case"
              className="block text-xs text-navy-400 mb-1.5 font-medium uppercase tracking-wider"
            >
              Primary Use Case
            </label>
            <select
              id="use-case"
              value={formState.useCase}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  useCase: e.target.value as UseCase,
                }))
              }
              className="w-full bg-navy-800/80 border border-navy-600/40 rounded-lg px-3 py-2.5 text-navy-100 text-base sm:text-sm focus:border-credex-500 focus:ring-1 focus:ring-credex-500 transition-colors appearance-none cursor-pointer"
            >
              {USE_CASE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-overspend-900/50 border border-overspend-600/30 rounded-lg px-4 py-3 text-overspend-200 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting || formState.tools.length === 0}
          className="flex-1 py-3 sm:py-3.5 bg-gradient-to-r from-credex-600 to-credex-500 hover:from-credex-500 hover:to-credex-400 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base shadow-lg shadow-credex-600/20 hover:shadow-credex-500/30 cursor-pointer"
          id="run-audit-btn"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            "Run Audit →"
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-3 sm:py-3.5 border border-navy-600/40 text-navy-300 hover:text-navy-100 hover:border-navy-500 rounded-xl transition-colors text-sm cursor-pointer"
          id="clear-form-btn"
        >
          Clear
        </button>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { AuditResult as AuditResultType, ToolInput } from "@/lib/audit-engine/types";
import { HeroSavings } from "./HeroSavings";
import { ToolCard } from "./ToolCard";
import { AISummary } from "./AISummary";
import { CredexCTA } from "./CredexCTA";
import { LeadCapture } from "../LeadCapture";
import { ShareBar } from "../ShareBar";
import { Logo } from "../Logo";

interface AuditResultProps {
  auditId: string;
  inputTools: ToolInput[];
  result: AuditResultType;
  aiSummary: string | null;
}

export function AuditResult({
  auditId,
  inputTools,
  result,
  aiSummary,
}: AuditResultProps) {
  const {
    tools,
    totalMonthlySavings,
    totalAnnualSavings,
    savingsPercent,
    showCredexCTA,
    isAlreadyOptimal,
  } = result;

  return (
    <div className="space-y-6 sm:space-y-8 animate-count-up">
      {/* Header / Home link */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={28} className="animate-float" />
          <h2 className="text-xl font-extrabold text-navy-50 tracking-tight font-display">
            SpendLens <span className="text-navy-400 font-medium font-sans">| Audit Report</span>
          </h2>
        </div>
        <Link
          href="/"
          className="text-xs font-semibold text-navy-300 hover:text-navy-100 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Run New Audit
        </Link>
      </div>

      {/* Hero Big Numbers */}
      <HeroSavings
        monthlySavings={totalMonthlySavings}
        annualSavings={totalAnnualSavings}
        savingsPercent={savingsPercent}
      />

      {/* AI Summary Block */}
      {aiSummary && <AISummary summary={aiSummary} />}

      {/* Main Grid: Tool Breakdown + Lead/Share */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tool Cards list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-navy-100 px-1">
            Tool-by-Tool Breakdown
          </h3>
          <div className="space-y-4">
            {tools.map((toolAudit) => {
              const originalInput = inputTools.find((t) => t.toolId === toolAudit.toolId) || {
                plan: "Pro",
                seats: 1,
              };
              return (
                <ToolCard
                  key={toolAudit.toolId}
                  audit={toolAudit}
                  inputPlan={originalInput.plan}
                  inputSeats={originalInput.seats}
                />
              );
            })}
          </div>
        </div>

        {/* Lead capture & share sidebar */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-navy-100 px-1">
            Next Steps
          </h3>
          
          <LeadCapture
            auditId={auditId}
            totalMonthlySavings={totalMonthlySavings}
          />
          
          <ShareBar
            auditId={auditId}
            totalMonthlySavings={totalMonthlySavings}
          />
        </div>
      </div>

      {/* Credex CTA */}
      {showCredexCTA && <CredexCTA savingsAmount={totalMonthlySavings} />}

      {/* Already Optimal State Info */}
      {isAlreadyOptimal && (
        <div className="glass-card p-5 border-savings-800/35 bg-savings-950/20 text-center text-sm text-savings-300">
          <span className="font-semibold text-savings-200">👏 Your AI tooling is well-optimized!</span>
          <p className="mt-1 text-xs text-navy-300">
            You are spending well and avoiding redundant subscriptions. We will notify you when new cost-saving optimizations launch.
          </p>
        </div>
      )}
    </div>
  );
}

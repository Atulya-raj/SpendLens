"use client";

import { formatCurrency } from "@/lib/utils";

interface CredexCTAProps {
  savingsAmount: number;
}

export function CredexCTA({ savingsAmount }: CredexCTAProps) {
  return (
    <div className="glass-card p-6 sm:p-7 border-navy-800/40 bg-navy-900 relative overflow-hidden shadow-lg shadow-navy-950/20">
      {/* Decorative colored accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-credex-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-credex-500/20 border border-credex-500/45 text-credex-300 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-credex-400 animate-ping" />
            Partner Recommendation
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight font-display">
            Convert these savings to AI credits with Credex
          </h3>
          <p className="text-sm leading-relaxed text-navy-800">
            You are wasting <strong className="text-credex-300 font-extrabold">{formatCurrency(savingsAmount)}/month</strong>. 
            Credex can help you purchase discounted subscription credits for Cursor, Claude, ChatGPT, and APIs, allowing you to capture these savings directly without changing your tech stack.
          </p>
        </div>

        <div className="shrink-0 flex items-center">
          <a
            href="https://credex.rocks/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-credex-600 to-credex-500 hover:from-credex-500 hover:to-credex-400 text-white text-sm font-semibold rounded-xl text-center shadow-lg shadow-credex-600/25 hover:shadow-credex-500/35 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer block"
            id="credex-cta-btn"
          >
            Claim Savings with Credex →
          </a>
        </div>
      </div>
    </div>
  );
}

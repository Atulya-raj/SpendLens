"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface HeroSavingsProps {
  monthlySavings: number;
  annualSavings: number;
  savingsPercent: number;
}

export function HeroSavings({
  monthlySavings,
  annualSavings,
  savingsPercent,
}: HeroSavingsProps) {
  const [displayMonthly, setDisplayMonthly] = useState(0);
  const [displayAnnual, setDisplayAnnual] = useState(0);

  useEffect(() => {
    const duration = 1200; // ms
    const startTime = performance.now();

    function update(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easeProgress = progress * (2 - progress);

      setDisplayMonthly(Math.round(easeProgress * monthlySavings));
      setDisplayAnnual(Math.round(easeProgress * annualSavings));

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }, [monthlySavings, annualSavings]);

  return (
    <div className="glass-card p-6 sm:p-8 text-center border-navy-500/20 relative overflow-hidden grid-bg">
      {/* Decorative top gradient border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-savings-500 to-credex-500" />
      
      <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-navy-400 mb-2">
        Projected Savings Found
      </p>

      <div className="space-y-1 mb-6">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight savings-gradient animate-count-up" id="monthly-savings-display">
          {formatCurrency(displayMonthly)}
          <span className="text-xl sm:text-2xl font-semibold text-navy-300 ml-1">/mo</span>
        </h1>
        <p className="text-sm sm:text-base text-navy-300 font-medium">
          Saving you <span className="text-savings-400 font-semibold">{Math.round(savingsPercent)}%</span> of your current AI budget
        </p>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-savings-950/40 border border-savings-800/35 text-savings-300 text-xs sm:text-sm font-medium">
        <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <span>Annual Savings: <strong className="text-savings-200">{formatCurrency(displayAnnual)}/yr</strong></span>
      </div>
    </div>
  );
}

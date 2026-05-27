"use client";

import { getBenchmark } from "@/lib/audit-engine/benchmarks";
import { formatCurrency } from "@/lib/utils";

interface BenchmarkCardProps {
  totalCurrentSpend: number;
  teamSize: number;
  currency?: "USD" | "INR";
}

export function BenchmarkCard({
  totalCurrentSpend,
  teamSize,
  currency = "USD",
}: BenchmarkCardProps) {
  // Prevent division by zero
  const safeTeamSize = Math.max(1, teamSize);
  const userSpendPerDev = totalCurrentSpend / safeTeamSize;
  
  const benchmark = getBenchmark(safeTeamSize);
  const benchmarkSpend = currency === "INR" ? benchmark.avgSpendPerDev * 95.78 : benchmark.avgSpendPerDev;

  const diffPercent = benchmarkSpend > 0 ? ((userSpendPerDev - benchmarkSpend) / benchmarkSpend) * 100 : 0;
  
  let statusText = "On Par";
  let statusColor = "text-navy-400";
  let statusBg = "bg-navy-900/10";
  let statusBorder = "border-navy-700/30";
  
  if (diffPercent > 20) {
    statusText = "Above Average";
    statusColor = "text-overspend-600";
    statusBg = "bg-overspend-100";
    statusBorder = "border-overspend-300";
  } else if (diffPercent < -20) {
    statusText = "Below Average";
    statusColor = "text-savings-700";
    statusBg = "bg-savings-100";
    statusBorder = "border-savings-300";
  }

  // Calculate widths for the bar chart
  const maxSpend = Math.max(userSpendPerDev, benchmarkSpend);
  const userBarWidth = maxSpend > 0 ? (userSpendPerDev / maxSpend) * 100 : 0;
  const benchmarkBarWidth = maxSpend > 0 ? (benchmarkSpend / maxSpend) * 100 : 0;

  return (
    <div id="benchmark-card" className="glass-card p-5 sm:p-6 mb-8 border-navy-700/30 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-bold text-navy-100 font-display flex items-center gap-2">
            <svg className="w-5 h-5 text-credex-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Benchmark Mode
          </h3>
          <p className="text-xs text-navy-300 mt-1 font-medium">
            How your spend compares to companies with {benchmark.label}
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${statusBg} ${statusColor} ${statusBorder}`}>
          {statusText}
        </div>
      </div>

      <div className="space-y-4">
        {/* User Spend Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-navy-100">Your AI spend</span>
            <span className="text-navy-100">{formatCurrency(userSpendPerDev, currency)}/dev/mo</span>
          </div>
          <div className="w-full bg-navy-900/10 rounded-full h-2.5 overflow-hidden border border-navy-700/20">
            <div 
              className={`h-full rounded-full ${diffPercent > 20 ? 'bg-overspend-500' : 'bg-navy-400'}`} 
              style={{ width: `${Math.max(userBarWidth, 2)}%` }}
            />
          </div>
        </div>

        {/* Benchmark Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-navy-300">Industry average</span>
            <span className="text-navy-300">{formatCurrency(benchmarkSpend, currency)}/dev/mo</span>
          </div>
          <div className="w-full bg-navy-900/10 rounded-full h-2.5 overflow-hidden border border-navy-700/20">
            <div 
              className="bg-credex-400 h-full rounded-full" 
              style={{ width: `${Math.max(benchmarkBarWidth, 2)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Industry average AI spend per developer per month (USD)
// Based on publicly reported data from SaaS spend reports
export const BENCHMARK_DATA: Record<string, { avgSpendPerDev: number; label: string }> = {
  "1-5": { avgSpendPerDev: 45, label: "1–5 developers" },
  "6-15": { avgSpendPerDev: 62, label: "6–15 developers" },
  "16-50": { avgSpendPerDev: 78, label: "16–50 developers" },
  "51-200": { avgSpendPerDev: 95, label: "51–200 developers" },
  "201+": { avgSpendPerDev: 110, label: "201+ developers" },
};

export function getBenchmark(teamSize: number): { avgSpendPerDev: number; label: string } {
  if (teamSize <= 5) return BENCHMARK_DATA["1-5"];
  if (teamSize <= 15) return BENCHMARK_DATA["6-15"];
  if (teamSize <= 50) return BENCHMARK_DATA["16-50"];
  if (teamSize <= 200) return BENCHMARK_DATA["51-200"];
  return BENCHMARK_DATA["201+"];
}

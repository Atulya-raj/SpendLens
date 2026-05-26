import { ToolInput, ToolAudit, UseCase } from "../types";
import { GEMINI_PRICING, getPlanPrice } from "../pricing";
import { formatCurrency } from "@/lib/utils";

export function auditGemini(
  input: ToolInput,
  useCase: UseCase,
  teamSize: number,
  currency: "USD" | "INR" = "USD"
): ToolAudit {
  const { plan, seats, monthlySpend } = input;
  const pricePerSeat = getPlanPrice(GEMINI_PRICING, plan, currency) ?? getPlanPrice(GEMINI_PRICING, "Pro", currency) ?? 19.99;
  const expectedSpend = pricePerSeat * seats;

  // Rule 1: Excess seats
  if (seats > teamSize * 1.2) {
    const rightSizedSeats = teamSize;
    const projected = pricePerSeat * rightSizedSeats;
    return {
      toolId: "gemini",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `You have ${seats} Gemini seats for a team of ${teamSize}. Reduce to ${rightSizedSeats} seats to save ${formatCurrency(monthlySpend - projected, currency)}/mo.`,
    };
  }

  // Rule 2: Ultra is extreme overkill for most use cases
  if (plan === "Ultra" && (useCase !== "data" && useCase !== "research")) {
    const projected = (getPlanPrice(GEMINI_PRICING, "Pro", currency) ?? 19.99) * seats;
    return {
      toolId: "gemini",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `Gemini Ultra (${formatCurrency(getPlanPrice(GEMINI_PRICING, "Ultra", currency) ?? 249.99, currency)}/mo) is designed for power users needing 2TB storage and advanced features. For ${useCase}, Pro at ${formatCurrency(getPlanPrice(GEMINI_PRICING, "Pro", currency) ?? 19.99, currency)}/seat covers your needs.`,
    };
  }

  // Rule 3: Overpaying
  if (expectedSpend > 0 && monthlySpend > expectedSpend * 1.1) {
    return {
      toolId: "gemini",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: expectedSpend,
      monthlySavings: monthlySpend - expectedSpend,
      reason: `You're paying ${formatCurrency(monthlySpend, currency)}/mo but ${seats} Gemini ${plan} seats should cost ${formatCurrency(expectedSpend, currency)}/mo — audit your subscription.`,
    };
  }

  // Rule 4: Optimal
  return {
    toolId: "gemini",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `Gemini ${plan} at ${seats} seats is well-sized for your team.`,
  };
}

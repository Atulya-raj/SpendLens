import { ToolInput, ToolAudit, UseCase } from "../types";
import { WINDSURF_PRICING, getPlanPrice } from "../pricing";
import { formatCurrency } from "@/lib/utils";

export function auditWindsurf(
  input: ToolInput,
  useCase: UseCase,
  teamSize: number,
  currency: "USD" | "INR" = "USD"
): ToolAudit {
  const { plan, seats, monthlySpend } = input;
  const pricePerSeat = getPlanPrice(WINDSURF_PRICING, plan, currency) ?? getPlanPrice(WINDSURF_PRICING, "Pro", currency) ?? 15;
  const expectedSpend = pricePerSeat * seats;

  // Rule 0: Orthogonal use-case
  if (useCase === "writing" || useCase === "research") {
    return {
      toolId: "windsurf",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "cancel_subscription",
      projectedMonthlySpend: 0,
      monthlySavings: monthlySpend,
      reason: `Windsurf is an AI code editor. Your team's primary use case is ${useCase}. You can cancel this subscription and use a standard chatbot like ChatGPT or Claude instead.`,
    };
  }

  // Rule 1: Excess seats
  if (seats > teamSize * 1.2) {
    const rightSizedSeats = teamSize;
    const projected = pricePerSeat * rightSizedSeats;
    return {
      toolId: "windsurf",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `You have ${seats} Windsurf seats for a team of ${teamSize}. Reduce to ${rightSizedSeats} to save ${formatCurrency(monthlySpend - projected, currency)}/mo.`,
    };
  }

  // Rule 2: Teams plan for small teams → Pro is sufficient
  if (plan === "Teams" && seats <= 3) {
    const projected = (getPlanPrice(WINDSURF_PRICING, "Pro", currency) ?? 15) * seats;
    return {
      toolId: "windsurf",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `Windsurf Teams adds team management features you don't need at ${seats} seats. Pro at ${formatCurrency(getPlanPrice(WINDSURF_PRICING, "Pro", currency) ?? 15, currency)}/seat provides the same AI capabilities.`,
    };
  }

  // Rule 3: Overpaying
  if (expectedSpend > 0 && monthlySpend > expectedSpend * 1.1) {
    return {
      toolId: "windsurf",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: expectedSpend,
      monthlySavings: monthlySpend - expectedSpend,
      reason: `You're paying ${formatCurrency(monthlySpend, currency)}/mo but ${seats} Windsurf ${plan} seats should cost ${formatCurrency(expectedSpend, currency)}/mo — check your billing.`,
    };
  }

  // Rule 4: Optimal
  return {
    toolId: "windsurf",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `Windsurf ${plan} at ${seats} seats is right-sized for your team.`,
  };
}

import { ToolInput, ToolAudit, UseCase } from "../types";
import { WINDSURF_PRICING } from "../pricing";

export function auditWindsurf(input: ToolInput, useCase: UseCase, teamSize: number): ToolAudit {
  const { plan, seats, monthlySpend } = input;
  const pricePerSeat = WINDSURF_PRICING[plan] ?? 15;
  const expectedSpend = pricePerSeat * seats;

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
      reason: `You have ${seats} Windsurf seats for a team of ${teamSize}. Reduce to ${rightSizedSeats} to save $${monthlySpend - projected}/mo.`,
    };
  }

  // Rule 2: Teams plan for small teams → Pro is sufficient
  if (plan === "Teams" && seats <= 3) {
    const projected = (WINDSURF_PRICING.Pro ?? 15) * seats;
    return {
      toolId: "windsurf",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `Windsurf Teams adds team management features you don't need at ${seats} seats. Pro at $15/seat provides the same AI capabilities.`,
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
      reason: `You're paying $${monthlySpend}/mo but ${seats} Windsurf ${plan} seats should cost $${expectedSpend}/mo — check your billing.`,
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

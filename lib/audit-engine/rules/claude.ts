import { ToolInput, ToolAudit, UseCase } from "../types";
import { CLAUDE_PRICING, getPlanPrice } from "../pricing";
import { formatCurrency } from "@/lib/utils";

export function auditClaude(
  input: ToolInput,
  useCase: UseCase,
  teamSize: number,
  currency: "USD" | "INR" = "USD"
): ToolAudit {
  const { plan, seats, monthlySpend } = input;
  const pricePerSeat = getPlanPrice(CLAUDE_PRICING, plan, currency) ?? getPlanPrice(CLAUDE_PRICING, "Pro", currency) ?? 20;
  const expectedSpend = pricePerSeat * seats;

  // Rule 1: Excess seats
  if (seats > teamSize * 1.2) {
    const rightSizedSeats = teamSize;
    const projected = pricePerSeat * rightSizedSeats;
    return {
      toolId: "claude",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `You have ${seats} Claude seats for a team of ${teamSize}. Reduce to ${rightSizedSeats} seats to save ${formatCurrency(monthlySpend - projected, currency)}/mo.`,
    };
  }

  // Rule 2: Multiple Pro seats → Team plan is better at 5+ seats
  if (plan === "Pro" && seats >= 5) {
    const teamCost = (getPlanPrice(CLAUDE_PRICING, "Team", currency) ?? 30) * seats;
    if (teamCost < monthlySpend) {
      return {
        toolId: "claude",
        currentMonthlySpend: monthlySpend,
        recommendedAction: "switch_tool",
        recommendedPlan: "Team",
        projectedMonthlySpend: teamCost,
        monthlySavings: monthlySpend - teamCost,
        reason: `At ${seats} seats, Claude Team (${formatCurrency(getPlanPrice(CLAUDE_PRICING, "Team", currency) ?? 30, currency)}/seat) gives you higher limits and admin controls. Consider consolidating.`,
      };
    }
  }

  // Rule 3: Max plan when usage doesn't justify it
  if (plan === "Max" && (useCase === "writing" || useCase === "research")) {
    const projected = (getPlanPrice(CLAUDE_PRICING, "Pro", currency) ?? 20) * seats;
    return {
      toolId: "claude",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `Claude Max provides 5x more usage, but for ${useCase} workflows, Pro's limits are typically sufficient. Save ${formatCurrency(monthlySpend - projected, currency)}/mo.`,
    };
  }

  // Rule 4: Overpaying
  if (expectedSpend > 0 && monthlySpend > expectedSpend * 1.1) {
    return {
      toolId: "claude",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: expectedSpend,
      monthlySavings: monthlySpend - expectedSpend,
      reason: `You're paying ${formatCurrency(monthlySpend, currency)}/mo but ${seats} Claude ${plan} seats should cost ${formatCurrency(expectedSpend, currency)}/mo — audit your seat count.`,
    };
  }

  // Rule 5: Optimal
  return {
    toolId: "claude",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `Claude ${plan} at ${seats} seats is well-configured for your ${useCase} workflow.`,
  };
}

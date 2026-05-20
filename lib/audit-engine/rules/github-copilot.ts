import { ToolInput, ToolAudit, UseCase } from "../types";
import { GITHUB_COPILOT_PRICING } from "../pricing";

export function auditGithubCopilot(input: ToolInput, useCase: UseCase, teamSize: number): ToolAudit {
  const { plan, seats, monthlySpend } = input;
  const pricePerSeat = GITHUB_COPILOT_PRICING[plan] ?? 19;
  const expectedSpend = pricePerSeat * seats;

  // Rule 1: Excess seats vs team size
  if (seats > teamSize * 1.2) {
    const rightSizedSeats = teamSize;
    const projected = pricePerSeat * rightSizedSeats;
    return {
      toolId: "github-copilot",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `You have ${seats} Copilot seats for a team of ${teamSize}. Right-size to ${rightSizedSeats} seats to save $${monthlySpend - projected}/mo.`,
    };
  }

  // Rule 2: Overpaying vs expected price
  if (expectedSpend > 0 && monthlySpend > expectedSpend * 1.1) {
    return {
      toolId: "github-copilot",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: expectedSpend,
      monthlySavings: monthlySpend - expectedSpend,
      reason: `You're paying $${monthlySpend}/mo but ${seats} Copilot ${plan} seats should cost $${expectedSpend}/mo — check for unused seats.`,
    };
  }

  // Rule 3: Enterprise overkill for small team
  if (plan === "Enterprise" && seats <= 10) {
    const projected = (GITHUB_COPILOT_PRICING.Business ?? 19) * seats;
    return {
      toolId: "github-copilot",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Business",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `Enterprise Copilot features (policy management, audit logs) are overkill at ${seats} seats. Business plan covers your needs at $19/seat.`,
    };
  }

  // Rule 4: Optimal
  return {
    toolId: "github-copilot",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `GitHub Copilot ${plan} at ${seats} seats is well-configured for your team.`,
  };
}

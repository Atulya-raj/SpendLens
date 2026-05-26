import { ToolInput, ToolAudit, UseCase } from "../types";
import { GITHUB_COPILOT_PRICING, getPlanPrice } from "../pricing";
import { formatCurrency } from "@/lib/utils";

export function auditGithubCopilot(
  input: ToolInput,
  useCase: UseCase,
  teamSize: number,
  currency: "USD" | "INR" = "USD"
): ToolAudit {
  const { plan, seats, monthlySpend } = input;
  const pricePerSeat = getPlanPrice(GITHUB_COPILOT_PRICING, plan, currency) ?? getPlanPrice(GITHUB_COPILOT_PRICING, "Business", currency) ?? 19;
  const expectedSpend = pricePerSeat * seats;

  // Rule 0: Orthogonal use-case
  if (useCase === "writing" || useCase === "research") {
    return {
      toolId: "github-copilot",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "cancel_subscription",
      projectedMonthlySpend: 0,
      monthlySavings: monthlySpend,
      reason: `GitHub Copilot is an AI coding assistant. Your team's primary use case is ${useCase}. You can cancel this subscription and use a standard chatbot instead.`,
    };
  }

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
      reason: `You have ${seats} Copilot seats for a team of ${teamSize}. Right-size to ${rightSizedSeats} seats to save ${formatCurrency(monthlySpend - projected, currency)}/mo.`,
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
      reason: `You're paying ${formatCurrency(monthlySpend, currency)}/mo but ${seats} Copilot ${plan} seats should cost ${formatCurrency(expectedSpend, currency)}/mo — check for unused seats.`,
    };
  }

  // Rule 3: Enterprise overkill for small team
  if (plan === "Enterprise" && seats <= 10) {
    const projected = (getPlanPrice(GITHUB_COPILOT_PRICING, "Business", currency) ?? 19) * seats;
    return {
      toolId: "github-copilot",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Business",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `Enterprise Copilot features (policy management, audit logs) are overkill at ${seats} seats. Business plan covers your needs at ${formatCurrency(getPlanPrice(GITHUB_COPILOT_PRICING, "Business", currency) ?? 19, currency)}/seat.`,
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

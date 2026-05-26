import { ToolInput, ToolAudit, UseCase } from "../types";
import { CHATGPT_PRICING, getPlanPrice } from "../pricing";
import { formatCurrency } from "@/lib/utils";

export function auditChatGPT(
  input: ToolInput,
  useCase: UseCase,
  teamSize: number,
  currency: "USD" | "INR" = "USD"
): ToolAudit {
  const { plan, seats, monthlySpend } = input;
  const pricePerSeat = getPlanPrice(CHATGPT_PRICING, plan, currency) ?? getPlanPrice(CHATGPT_PRICING, "Plus", currency) ?? 20;
  const expectedSpend = pricePerSeat * seats;

  // Rule 1: Excess seats
  if (seats > teamSize * 1.2) {
    const rightSizedSeats = teamSize;
    const projected = pricePerSeat * rightSizedSeats;
    return {
      toolId: "chatgpt",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `You have ${seats} ChatGPT seats for a team of ${teamSize}. Reduce to ${rightSizedSeats} seats to save ${formatCurrency(monthlySpend - projected, currency)}/mo.`,
    };
  }

  // Rule 2: Enterprise overkill for smaller teams
  if (plan === "Enterprise" && seats <= 15) {
    const teamCost = (getPlanPrice(CHATGPT_PRICING, "Team", currency) ?? 30) * seats;
    return {
      toolId: "chatgpt",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Team",
      projectedMonthlySpend: teamCost,
      monthlySavings: monthlySpend - teamCost,
      reason: `ChatGPT Enterprise features (SSO, admin console) add cost without proportional value at ${seats} seats. Team plan covers collaboration needs.`,
    };
  }

  // Rule 3: Multiple Plus seats → Team plan at 2+ users
  if (plan === "Plus" && seats >= 2) {
    // Team is $30/seat but includes workspace features
    // Only recommend if they're already spending more per-seat equivalent
    const teamCost = (getPlanPrice(CHATGPT_PRICING, "Team", currency) ?? 30) * seats;
    if (monthlySpend > teamCost) {
      return {
        toolId: "chatgpt",
        currentMonthlySpend: monthlySpend,
        recommendedAction: "switch_tool",
        recommendedPlan: "Team",
        projectedMonthlySpend: teamCost,
        monthlySavings: monthlySpend - teamCost,
        reason: `At ${seats} seats, ChatGPT Team (${formatCurrency(getPlanPrice(CHATGPT_PRICING, "Team", currency) ?? 30, currency)}/seat) may save money vs individual Plus subscriptions and adds workspace features.`,
      };
    }
  }

  // Rule 4: Overpaying
  if (expectedSpend > 0 && monthlySpend > expectedSpend * 1.1) {
    return {
      toolId: "chatgpt",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: expectedSpend,
      monthlySavings: monthlySpend - expectedSpend,
      reason: `You're paying ${formatCurrency(monthlySpend, currency)}/mo but ${seats} ChatGPT ${plan} seats should cost ${formatCurrency(expectedSpend, currency)}/mo — check billing.`,
    };
  }

  // Rule 5: Optimal
  return {
    toolId: "chatgpt",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `ChatGPT ${plan} at ${seats} seats is appropriately sized for your team.`,
  };
}

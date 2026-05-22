import { ToolInput, ToolAudit, UseCase } from "../types";
import { CURSOR_PRICING } from "../pricing";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function auditCursor(input: ToolInput, useCase: UseCase, teamSize?: number): ToolAudit {
  const { plan, seats, monthlySpend } = input;
  const pricePerSeat = CURSOR_PRICING[plan] ?? 40;
  const expectedSpend = pricePerSeat * seats;

  // Rule 0: Orthogonal use-case
  if (useCase === "writing" || useCase === "research") {
    return {
      toolId: "cursor",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "cancel_subscription",
      projectedMonthlySpend: 0,
      monthlySavings: monthlySpend,
      reason: `Cursor is an AI code editor. Your team's primary use case is ${useCase}. You can cancel this subscription and use a standard chatbot like ChatGPT or Claude instead.`,
    };
  }

  // Rule 1: Overpaying vs listed price (manual seat count error)
  if (expectedSpend > 0 && monthlySpend > expectedSpend * 1.1) {
    return {
      toolId: "cursor",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: expectedSpend,
      monthlySavings: monthlySpend - expectedSpend,
      reason: `You're paying $${monthlySpend}/mo but ${seats} Cursor ${plan} seats should cost $${expectedSpend}/mo — audit your seat count.`,
    };
  }

  // Rule 2: Business plan for ≤3 users on non-coding workflow → Pro is sufficient
  if (plan === "Business" && seats <= 3 && useCase !== "coding") {
    const projected = (CURSOR_PRICING.Pro ?? 20) * seats;
    return {
      toolId: "cursor",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `Business plan adds admin controls valuable at 10+ devs; at ${seats} seats on a ${useCase} workflow, Pro covers all model access at $20/seat.`,
    };
  }

  // Rule 3: Business plan for small coding teams → still recommend downgrade
  if (plan === "Business" && seats <= 3 && useCase === "coding") {
    const projected = (CURSOR_PRICING.Pro ?? 20) * seats;
    return {
      toolId: "cursor",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `At ${seats} developers, Cursor Pro provides the same model access and completions. Business admin features aren't necessary below 10 seats.`,
    };
  }

  // Rule 4: Optimal
  return {
    toolId: "cursor",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `Cursor ${plan} at ${seats} seats is right-sized for your team and use case.`,
  };
}

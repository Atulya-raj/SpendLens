import { ToolInput, ToolAudit, UseCase } from "../types";
import { OPENAI_API_EQUIVALENT_TEAM_COST, getEquivalentTeamCost } from "../pricing";
import { formatCurrency } from "@/lib/utils";

export function auditOpenAIApi(
  input: ToolInput,
  _useCase: UseCase,
  teamSize: number,
  currency: "USD" | "INR" = "USD"
): ToolAudit {
  const { monthlySpend } = input;

  // Rule 1: API spend exceeds equivalent subscription cost
  const equivalentSubCost = getEquivalentTeamCost(OPENAI_API_EQUIVALENT_TEAM_COST, currency) * teamSize;
  if (monthlySpend > equivalentSubCost && teamSize <= 20) {
    return {
      toolId: "openai-api",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "switch_tool",
      recommendedTool: "ChatGPT Team",
      projectedMonthlySpend: equivalentSubCost,
      monthlySavings: monthlySpend - equivalentSubCost,
      reason: `Your OpenAI API spend (${formatCurrency(monthlySpend, currency)}/mo) exceeds a ChatGPT Team subscription (${formatCurrency(equivalentSubCost, currency)}/mo for ${teamSize} users). Consider switching for predictable billing.`,
    };
  }

  // Rule 2: Optimal
  return {
    toolId: "openai-api",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `OpenAI API at ${formatCurrency(monthlySpend, currency)}/mo is cost-effective for your usage — a Team subscription would cost more.`,
  };
}

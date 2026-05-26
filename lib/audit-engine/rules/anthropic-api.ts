import { ToolInput, ToolAudit, UseCase } from "../types";
import { ANTHROPIC_API_EQUIVALENT_TEAM_COST, getEquivalentTeamCost } from "../pricing";
import { formatCurrency } from "@/lib/utils";

export function auditAnthropicApi(
  input: ToolInput,
  _useCase: UseCase,
  teamSize: number,
  currency: "USD" | "INR" = "USD"
): ToolAudit {
  const { monthlySpend } = input;

  // Rule 1: API spend exceeds equivalent subscription cost
  const equivalentSubCost = getEquivalentTeamCost(ANTHROPIC_API_EQUIVALENT_TEAM_COST, currency) * teamSize;
  if (monthlySpend > equivalentSubCost && teamSize <= 20) {
    return {
      toolId: "anthropic-api",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "switch_tool",
      recommendedTool: "Claude Team",
      projectedMonthlySpend: equivalentSubCost,
      monthlySavings: monthlySpend - equivalentSubCost,
      reason: `Your Anthropic API spend (${formatCurrency(monthlySpend, currency)}/mo) exceeds a Claude Team subscription (${formatCurrency(equivalentSubCost, currency)}/mo for ${teamSize} users). Consider switching for predictable costs.`,
    };
  }

  // Rule 2: Optimal
  return {
    toolId: "anthropic-api",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `Anthropic API at ${formatCurrency(monthlySpend, currency)}/mo is cost-effective for your usage level — subscription alternatives would cost more.`,
  };
}

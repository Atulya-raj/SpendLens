import { ToolInput, ToolAudit, UseCase } from "../types";
import { ANTHROPIC_API_EQUIVALENT_TEAM_COST } from "../pricing";

export function auditAnthropicApi(input: ToolInput, _useCase: UseCase, teamSize: number): ToolAudit {
  const { monthlySpend } = input;

  // Rule 1: API spend exceeds equivalent subscription cost
  const equivalentSubCost = ANTHROPIC_API_EQUIVALENT_TEAM_COST * teamSize;
  if (monthlySpend > equivalentSubCost && teamSize <= 20) {
    return {
      toolId: "anthropic-api",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "switch_tool",
      recommendedTool: "Claude Team",
      projectedMonthlySpend: equivalentSubCost,
      monthlySavings: monthlySpend - equivalentSubCost,
      reason: `Your Anthropic API spend ($${monthlySpend}/mo) exceeds a Claude Team subscription ($${equivalentSubCost}/mo for ${teamSize} users). Consider switching for predictable costs.`,
    };
  }

  // Rule 2: Optimal
  return {
    toolId: "anthropic-api",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `Anthropic API at $${monthlySpend}/mo is cost-effective for your usage level — subscription alternatives would cost more.`,
  };
}

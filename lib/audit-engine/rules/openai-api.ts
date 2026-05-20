import { ToolInput, ToolAudit, UseCase } from "../types";
import { OPENAI_API_EQUIVALENT_TEAM_COST } from "../pricing";

export function auditOpenAIApi(input: ToolInput, _useCase: UseCase, teamSize: number): ToolAudit {
  const { monthlySpend } = input;

  // Rule 1: API spend exceeds equivalent subscription cost
  const equivalentSubCost = OPENAI_API_EQUIVALENT_TEAM_COST * teamSize;
  if (monthlySpend > equivalentSubCost && teamSize <= 20) {
    return {
      toolId: "openai-api",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "switch_tool",
      recommendedTool: "ChatGPT Team",
      projectedMonthlySpend: equivalentSubCost,
      monthlySavings: monthlySpend - equivalentSubCost,
      reason: `Your OpenAI API spend ($${monthlySpend}/mo) exceeds a ChatGPT Team subscription ($${equivalentSubCost}/mo for ${teamSize} users). Consider switching for predictable billing.`,
    };
  }

  // Rule 2: Optimal
  return {
    toolId: "openai-api",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `OpenAI API at $${monthlySpend}/mo is cost-effective for your usage — a Team subscription would cost more.`,
  };
}

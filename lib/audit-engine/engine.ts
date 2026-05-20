import { AuditInput, AuditResult, ToolAudit, ToolInput } from "./types";
import { auditCursor } from "./rules/cursor";
import { auditGithubCopilot } from "./rules/github-copilot";
import { auditClaude } from "./rules/claude";
import { auditChatGPT } from "./rules/chatgpt";
import { auditAnthropicApi } from "./rules/anthropic-api";
import { auditOpenAIApi } from "./rules/openai-api";
import { auditGemini } from "./rules/gemini";
import { auditWindsurf } from "./rules/windsurf";

function auditTool(tool: ToolInput, useCase: AuditInput["useCase"], teamSize: number): ToolAudit {
  switch (tool.toolId) {
    case "cursor":
      return auditCursor(tool, useCase, teamSize);
    case "github-copilot":
      return auditGithubCopilot(tool, useCase, teamSize);
    case "claude":
      return auditClaude(tool, useCase, teamSize);
    case "chatgpt":
      return auditChatGPT(tool, useCase, teamSize);
    case "anthropic-api":
      return auditAnthropicApi(tool, useCase, teamSize);
    case "openai-api":
      return auditOpenAIApi(tool, useCase, teamSize);
    case "gemini":
      return auditGemini(tool, useCase, teamSize);
    case "windsurf":
      return auditWindsurf(tool, useCase, teamSize);
    default:
      return {
        toolId: tool.toolId,
        currentMonthlySpend: tool.monthlySpend,
        recommendedAction: "already_optimal",
        projectedMonthlySpend: tool.monthlySpend,
        monthlySavings: 0,
        reason: "No audit rules available for this tool.",
      };
  }
}

/**
 * Apply cross-tool rules that detect overlap and redundancy
 * between multiple tools in the user's stack.
 */
function applyCrossToolRules(audits: ToolAudit[], input: AuditInput): ToolAudit[] {
  const toolIds = input.tools.map((t) => t.toolId);
  const result = [...audits];

  // Cross-tool rule 1: Cursor + GitHub Copilot overlap for coding
  const hasCursor = toolIds.includes("cursor");
  const hasCopilot = toolIds.includes("github-copilot");
  if (hasCursor && hasCopilot && (input.useCase === "coding" || input.useCase === "mixed")) {
    const copilotIdx = result.findIndex((a) => a.toolId === "github-copilot");
    if (copilotIdx !== -1 && result[copilotIdx].recommendedAction === "already_optimal") {
      const copilotAudit = result[copilotIdx];
      result[copilotIdx] = {
        ...copilotAudit,
        recommendedAction: "switch_tool",
        recommendedTool: "Cursor",
        projectedMonthlySpend: 0,
        monthlySavings: copilotAudit.currentMonthlySpend,
        reason: `You're paying for both Cursor and GitHub Copilot for coding. Cursor provides superior context awareness — drop Copilot to save $${copilotAudit.currentMonthlySpend}/mo.`,
      };
    }
  }

  // Cross-tool rule 2: ChatGPT + Claude overlap for writing/mixed
  const hasClaude = toolIds.includes("claude");
  const hasChatGPT = toolIds.includes("chatgpt");
  if (hasClaude && hasChatGPT && (input.useCase === "writing" || input.useCase === "mixed")) {
    const claudeAudit = result.find((a) => a.toolId === "claude");
    const chatgptAudit = result.find((a) => a.toolId === "chatgpt");

    if (claudeAudit && chatgptAudit) {
      // Recommend dropping the more expensive one
      if (claudeAudit.currentMonthlySpend >= chatgptAudit.currentMonthlySpend) {
        const claudeIdx = result.findIndex((a) => a.toolId === "claude");
        if (claudeIdx !== -1 && result[claudeIdx].recommendedAction === "already_optimal") {
          result[claudeIdx] = {
            ...result[claudeIdx],
            recommendedAction: "switch_tool",
            recommendedTool: "ChatGPT",
            projectedMonthlySpend: 0,
            monthlySavings: result[claudeIdx].currentMonthlySpend,
            reason: `You're paying for both Claude and ChatGPT for ${input.useCase}. Consider consolidating to ChatGPT (lower cost per seat) to save $${result[claudeIdx].currentMonthlySpend}/mo.`,
          };
        }
      } else {
        const chatgptIdx = result.findIndex((a) => a.toolId === "chatgpt");
        if (chatgptIdx !== -1 && result[chatgptIdx].recommendedAction === "already_optimal") {
          result[chatgptIdx] = {
            ...result[chatgptIdx],
            recommendedAction: "switch_tool",
            recommendedTool: "Claude",
            projectedMonthlySpend: 0,
            monthlySavings: result[chatgptIdx].currentMonthlySpend,
            reason: `You're paying for both ChatGPT and Claude for ${input.useCase}. Consider consolidating to Claude (lower cost per seat) to save $${result[chatgptIdx].currentMonthlySpend}/mo.`,
          };
        }
      }
    }
  }

  return result;
}

/**
 * Main audit entry point — pure function, no side effects.
 */
export function runAudit(input: AuditInput): AuditResult {
  // Run per-tool audits
  const toolAudits = input.tools.map((tool) =>
    auditTool(tool, input.useCase, input.teamSize)
  );

  // Apply cross-tool rules
  const finalAudits = applyCrossToolRules(toolAudits, input);

  const totalCurrentSpend = finalAudits.reduce((s, t) => s + t.currentMonthlySpend, 0);
  const totalProjectedSpend = finalAudits.reduce((s, t) => s + t.projectedMonthlySpend, 0);
  const totalMonthlySavings = totalCurrentSpend - totalProjectedSpend;

  return {
    tools: finalAudits,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    totalCurrentSpend,
    totalProjectedSpend,
    savingsPercent: totalCurrentSpend > 0 ? (totalMonthlySavings / totalCurrentSpend) * 100 : 0,
    showCredexCTA: totalMonthlySavings > 500,
    isAlreadyOptimal: totalMonthlySavings < 100,
  };
}

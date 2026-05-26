import { AuditInput, AuditResult, ToolAudit, ToolInput } from "./types";
import { auditCursor } from "./rules/cursor";
import { auditGithubCopilot } from "./rules/github-copilot";
import { auditClaude } from "./rules/claude";
import { auditChatGPT } from "./rules/chatgpt";
import { auditAnthropicApi } from "./rules/anthropic-api";
import { auditOpenAIApi } from "./rules/openai-api";
import { auditGemini } from "./rules/gemini";
import { auditWindsurf } from "./rules/windsurf";
import { formatCurrency } from "@/lib/utils";

function auditTool(
  tool: ToolInput,
  useCase: AuditInput["useCase"],
  teamSize: number,
  currency: "USD" | "INR" = "USD"
): ToolAudit {
  switch (tool.toolId) {
    case "cursor":
      return auditCursor(tool, useCase, teamSize, currency);
    case "github-copilot":
      return auditGithubCopilot(tool, useCase, teamSize, currency);
    case "claude":
      return auditClaude(tool, useCase, teamSize, currency);
    case "chatgpt":
      return auditChatGPT(tool, useCase, teamSize, currency);
    case "anthropic-api":
      return auditAnthropicApi(tool, useCase, teamSize, currency);
    case "openai-api":
      return auditOpenAIApi(tool, useCase, teamSize, currency);
    case "gemini":
      return auditGemini(tool, useCase, teamSize, currency);
    case "windsurf":
      return auditWindsurf(tool, useCase, teamSize, currency);
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
function applyCrossToolRules(
  audits: ToolAudit[],
  input: AuditInput,
  currency: "USD" | "INR" = "USD"
): ToolAudit[] {
  const toolIds = input.tools.map((t) => t.toolId);
  const result = [...audits];

  // Helper to mark a tool as canceled/switched
  const cancelTool = (
    toolId: string,
    reason: string,
    action: "cancel_subscription" | "switch_tool" = "cancel_subscription",
    recommendedTool?: string
  ) => {
    const idx = result.findIndex((a) => a.toolId === toolId);
    if (idx !== -1 && result[idx].recommendedAction === "already_optimal") {
      result[idx] = {
        ...result[idx],
        recommendedAction: action,
        recommendedTool,
        projectedMonthlySpend: 0,
        monthlySavings: result[idx].currentMonthlySpend,
        reason,
      };
    }
  };

  // Cross-tool rule 1: Coding Agents Overlap (Cursor, Windsurf, Copilot)
  const hasCursor = toolIds.includes("cursor");
  const hasWindsurf = toolIds.includes("windsurf");
  const hasCopilot = toolIds.includes("github-copilot");

  if ((hasCursor || hasWindsurf || hasCopilot) && (input.useCase === "coding" || input.useCase === "mixed")) {
    // If they have multiple IDEs (Cursor and Windsurf), recommend keeping the one with higher spend or default to Cursor
    if (hasCursor && hasWindsurf) {
      const cursorSpend = result.find(a => a.toolId === "cursor")?.currentMonthlySpend || 0;
      const windsurfSpend = result.find(a => a.toolId === "windsurf")?.currentMonthlySpend || 0;
      
      if (windsurfSpend > cursorSpend && cursorSpend > 0) {
        cancelTool(
          "cursor",
          `You are paying for both Windsurf and Cursor. Since you spend more on Windsurf, drop Cursor to save ${formatCurrency(cursorSpend, currency)}/mo.`,
          "cancel_subscription"
        );
      } else if (windsurfSpend > 0) {
        cancelTool(
          "windsurf",
          `You are paying for both Cursor and Windsurf. Stick to Cursor to consolidate your AI IDEs and save ${formatCurrency(windsurfSpend, currency)}/mo.`,
          "cancel_subscription"
        );
      }
    }

    // If they have Copilot AND an AI IDE (Cursor or Windsurf), recommend dropping Copilot
    if (hasCopilot && (hasCursor || hasWindsurf)) {
      const activeIDE = hasCursor ? "Cursor" : "Windsurf";
      const copilotSpend = result.find(a => a.toolId === "github-copilot")?.currentMonthlySpend || 0;
      if (copilotSpend > 0) {
        cancelTool(
          "github-copilot",
          `You're paying for both ${activeIDE} and GitHub Copilot. ${activeIDE} provides superior context awareness — drop Copilot to save ${formatCurrency(copilotSpend, currency)}/mo.`,
          "switch_tool",
          activeIDE
        );
      }
    }
  }

  // Cross-tool rule 2: Chatbot Overlap (ChatGPT, Claude, Gemini)
  const hasClaude = toolIds.includes("claude");
  const hasChatGPT = toolIds.includes("chatgpt");
  const hasGemini = toolIds.includes("gemini");

  if (
    (hasClaude ? 1 : 0) + (hasChatGPT ? 1 : 0) + (hasGemini ? 1 : 0) >= 2 &&
    (input.useCase === "writing" || input.useCase === "mixed" || input.useCase === "research")
  ) {
    const chatbots = [
      { id: "claude" as const, name: "Claude", spend: result.find(a => a.toolId === "claude")?.currentMonthlySpend || 0 },
      { id: "chatgpt" as const, name: "ChatGPT", spend: result.find(a => a.toolId === "chatgpt")?.currentMonthlySpend || 0 },
      { id: "gemini" as const, name: "Gemini", spend: result.find(a => a.toolId === "gemini")?.currentMonthlySpend || 0 }
    ].filter(c => toolIds.includes(c.id));

    // Sort by spend descending
    chatbots.sort((a, b) => b.spend - a.spend);
    
    // Keep the first one, cancel the rest
    const primary = chatbots[0];
    for (let i = 1; i < chatbots.length; i++) {
      if (chatbots[i].spend > 0) {
        cancelTool(
          chatbots[i].id,
          `You're paying for multiple general AI chatbots. Consolidate to ${primary.name} to save ${formatCurrency(chatbots[i].spend, currency)}/mo.`,
          "switch_tool",
          primary.name
        );
      }
    }
  }

  // Cross-tool rule 3: API Consolidation (OpenAI API + Anthropic API)
  const hasOpenAI = toolIds.includes("openai-api");
  const hasAnthropic = toolIds.includes("anthropic-api");
  
  if (hasOpenAI && hasAnthropic) {
    const openaiSpend = result.find(a => a.toolId === "openai-api")?.currentMonthlySpend || 0;
    const anthropicSpend = result.find(a => a.toolId === "anthropic-api")?.currentMonthlySpend || 0;
    
    const highSpendThreshold = currency === "INR" ? 9578 : 100; // $100 equivalent in INR
    if (openaiSpend + anthropicSpend > highSpendThreshold) {
      // Don't cancel, but suggest an LLM router
      const idxOpenAI = result.findIndex(a => a.toolId === "openai-api");
      if (idxOpenAI !== -1 && result[idxOpenAI].recommendedAction === "already_optimal") {
        const potentialSavings = Math.round(openaiSpend * 0.2);
        result[idxOpenAI] = {
          ...result[idxOpenAI],
          recommendedAction: "switch_tool",
          recommendedTool: "LLM Router (e.g. Credex)",
          projectedMonthlySpend: openaiSpend * 0.8, // assume 20% savings via router
          monthlySavings: potentialSavings,
          reason: `High spend across multiple LLM APIs. Consider using an LLM router to optimize routing and caching, which typically saves ~20% (${formatCurrency(potentialSavings, currency)}/mo on OpenAI).`,
        };
      }
    }
  }

  return result;
}

/**
 * Main audit entry point — pure function, no side effects.
 */
export function runAudit(input: AuditInput): AuditResult {
  const currency = input.currency || "USD";

  // Run per-tool audits
  const toolAudits = input.tools.map((tool) =>
    auditTool(tool, input.useCase, input.teamSize, currency)
  );

  // Apply cross-tool rules
  const finalAudits = applyCrossToolRules(toolAudits, input, currency);

  const totalCurrentSpend = finalAudits.reduce((s, t) => s + t.currentMonthlySpend, 0);
  const totalProjectedSpend = finalAudits.reduce((s, t) => s + t.projectedMonthlySpend, 0);
  const totalMonthlySavings = totalCurrentSpend - totalProjectedSpend;

  // Thresholds scaled for currency checks: CTA if savings > $500, optimal if savings < $100
  const savingsUSD = currency === "INR" ? totalMonthlySavings / 95.78 : totalMonthlySavings;

  return {
    tools: finalAudits,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    totalCurrentSpend,
    totalProjectedSpend,
    savingsPercent: totalCurrentSpend > 0 ? (totalMonthlySavings / totalCurrentSpend) * 100 : 0,
    showCredexCTA: savingsUSD > 500,
    isAlreadyOptimal: savingsUSD < 100,
    currency,
  };
}

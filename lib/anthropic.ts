import { AuditResult } from "./audit-engine/types";

/**
 * Generate AI summary using Anthropic API.
 * Falls back to template if API key is missing or call fails.
 */
export async function generateAISummary(
  result: AuditResult,
  useCase: string,
  teamSize: number
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return generateFallbackSummary(result);
  }

  try {
    const toolFindings = result.tools
      .map((t) => `  • ${t.toolId}: ${t.reason}`)
      .join("\n");

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system:
          "You are a concise financial advisor for startup CTOs and engineering managers. You write in plain English, no jargon, no fluff. You never hallucinate numbers.",
        messages: [
          {
            role: "user",
            content: `Here is a startup's AI tool audit result:
- Team size: ${teamSize}
- Primary use case: ${useCase}
- Total current monthly spend: $${result.totalCurrentSpend}
- Total projected monthly spend after optimizations: $${result.totalProjectedSpend}
- Monthly savings: $${result.totalMonthlySavings} (${result.savingsPercent.toFixed(1)}%)
- Tool-by-tool findings:
${toolFindings}

Write a 80-100 word personalized audit summary paragraph. Be specific to their numbers.
Lead with the biggest saving opportunity. End with one actionable next step.
Do NOT start with "I" or "Your audit shows". Be direct.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status);
      return generateFallbackSummary(result);
    }

    const data = await response.json();
    const content = data?.content?.[0]?.text;
    if (content) return content;

    return generateFallbackSummary(result);
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return generateFallbackSummary(result);
  }
}

export function generateFallbackSummary(
  result: AuditResult
): string {
  if (result.isAlreadyOptimal) {
    return `Your AI stack is well-optimized for your current usage. You're spending $${result.totalCurrentSpend}/month with no major inefficiencies detected. Keep reviewing quarterly as your team scales — plan pricing thresholds shift significantly above 10 seats for most vendors.`;
  }

  const biggestSaving = result.tools
    .filter((t) => t.monthlySavings > 0)
    .sort((a, b) => b.monthlySavings - a.monthlySavings)[0];

  const biggestReason =
    biggestSaving?.reason ??
    "right-sizing your subscriptions to your actual seat count";

  return `Your AI tooling carries $${result.totalMonthlySavings}/month in avoidable spend — $${result.totalAnnualSavings} annually. The biggest opportunity is ${biggestReason}. Addressing this within 30 days is a straightforward engineering manager win.`;
}

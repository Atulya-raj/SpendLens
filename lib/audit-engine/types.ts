export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export interface ToolInput {
  toolId: ToolId;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export type ActionType =
  | "downgrade_plan"
  | "reduce_seats"
  | "switch_tool"
  | "use_credits"
  | "cancel_subscription"
  | "already_optimal";

export interface ToolAudit {
  toolId: ToolId;
  currentMonthlySpend: number;
  recommendedAction: ActionType;
  recommendedPlan?: string;
  recommendedTool?: string;
  projectedMonthlySpend: number;
  monthlySavings: number;
  reason: string;
}

export interface AuditResult {
  tools: ToolAudit[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  totalProjectedSpend: number;
  savingsPercent: number;
  showCredexCTA: boolean;
  isAlreadyOptimal: boolean;
}

/** Tool display metadata */
export const TOOL_DISPLAY_NAMES: Record<ToolId, string> = {
  cursor: "Cursor",
  "github-copilot": "GitHub Copilot",
  claude: "Claude",
  chatgpt: "ChatGPT",
  "anthropic-api": "Anthropic API",
  "openai-api": "OpenAI API",
  gemini: "Gemini",
  windsurf: "Windsurf",
};

/** Plans available for each tool */
export const TOOL_PLANS: Record<ToolId, string[]> = {
  cursor: ["Hobby", "Pro", "Business"],
  "github-copilot": ["Individual", "Business", "Enterprise"],
  claude: ["Pro", "Max", "Team", "Enterprise"],
  chatgpt: ["Plus", "Team", "Enterprise"],
  "anthropic-api": ["Pay-as-you-go"],
  "openai-api": ["Pay-as-you-go"],
  gemini: ["Pro", "Ultra"],
  windsurf: ["Free", "Pro", "Teams"],
};

/**
 * Centralized pricing data for all supported AI tools.
 * All prices in USD per user/month unless noted.
 * Source URLs and verification dates in PRICING_DATA.md
 */

export const CURSOR_PRICING: Record<string, number | null> = {
  Hobby: 0,
  Pro: 20,
  Business: 40,
  Enterprise: null, // custom pricing
};

export const GITHUB_COPILOT_PRICING: Record<string, number | null> = {
  Individual: 10,
  Business: 19,
  Enterprise: 39,
};

export const CLAUDE_PRICING: Record<string, number | null> = {
  Pro: 20,
  Max: 100,
  Team: 30, // min 5 seats
  Enterprise: null, // custom pricing
};

export const CHATGPT_PRICING: Record<string, number | null> = {
  Plus: 20,
  Team: 30, // min 2 seats
  Enterprise: null, // custom pricing
};

export const GEMINI_PRICING: Record<string, number | null> = {
  Pro: 19.99,
  Ultra: 249.99,
};

export const WINDSURF_PRICING: Record<string, number | null> = {
  Free: 0,
  Pro: 15,
  Teams: 35,
};

// API tools don't have per-seat pricing — we compare monthly spend
// against equivalent subscription cost
export const ANTHROPIC_API_EQUIVALENT_TEAM_COST = 30; // per user/mo (Claude Team)
export const OPENAI_API_EQUIVALENT_TEAM_COST = 30; // per user/mo (ChatGPT Team)

export const EXCHANGE_RATE = 95.78;

export function getPlanPrice(
  pricingTable: Record<string, number | null>,
  plan: string,
  currency: "USD" | "INR" = "USD"
): number | null {
  const usdPrice = pricingTable[plan];
  if (usdPrice === undefined || usdPrice === null) return null;
  if (currency === "INR") {
    return Math.round(usdPrice * EXCHANGE_RATE);
  }
  return usdPrice;
}

export function getEquivalentTeamCost(
  usdCost: number,
  currency: "USD" | "INR" = "USD"
): number {
  if (currency === "INR") {
    return Math.round(usdCost * EXCHANGE_RATE);
  }
  return usdCost;
}

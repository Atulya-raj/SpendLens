# SpendLens — Pricing Reference Data

This document acts as the official registry of AI tool pricing tiers used by the SpendLens audit engine. All data is synchronized as of **May 2026**.

---

## 📋 Subscription Plan Pricing (Monthly, USD)

| Tool ID | Plan | Price / Seat / Mo | Notes / Constraints |
|---|---|---|---|
| **cursor** | Pro | $20 | Individual developers |
| | Business | $40 | Team features, centralized billing |
| **copilot** | Individual | $10 | Personal accounts |
| | Business | $19 | Organization-managed accounts |
| **chatgpt** | Plus | $20 | Individual Plus accounts |
| | Team | $30 | Min 2 seats required |
| **claude** | Pro | $20 | Individual Pro accounts |
| | Team | $30 | Min 5 seats required |
| **gemini** | Advanced | $20 | Individual Google Workspace/One |
| | Business | $20 | Workspace team add-on |
| **windsurf** | Pro | $15 | Individual developers |
| | Teams | $30 | Team features |

---

## 📈 API Optimization Reference Limits

For API pricing, spend is variable. However, we define standard thresholds where fixed subscriptions become more cost-effective:

### 1. OpenAI API
- **Claude / ChatGPT Team equivalent**: $30/user/month.
- **Rule**: If OpenAI API spend exceeds `$30 * teamSize`, suggest migrating users to ChatGPT Team subscriptions to cap usage billing.

### 2. Anthropic API
- **Claude Team equivalent**: $30/user/month.
- **Rule**: If Anthropic API spend exceeds `$30 * teamSize`, suggest migrating users to Claude Team subscriptions to cap usage billing.

---

## 🔗 Official Reference Sources

- **Cursor**: [cursor.com/pricing](https://www.cursor.com/pricing)
- **GitHub Copilot**: [github.com/features/copilot#pricing](https://github.com/features/copilot#pricing)
- **ChatGPT**: [openai.com/chatgpt/pricing](https://openai.com/chatgpt/pricing)
- **Claude**: [anthropic.com/claude/pricing](https://www.anthropic.com/claude/pricing)
- **Gemini**: [gemini.google.com/advanced](https://gemini.google.com/advanced)
- **Windsurf**: [codeium.com/windsurf/pricing](https://codeium.com/windsurf/pricing)

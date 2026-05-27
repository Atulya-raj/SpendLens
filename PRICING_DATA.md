# SpendLens — Pricing Data

Every number in our audit engine traces back to an official vendor pricing page. Here's exactly what we use, where we got it, and when we last verified it.

---

## Cursor
- Hobby: $0/user/month — https://www.cursor.com/pricing — verified 2026-05-20
- Pro: $20/user/month — https://www.cursor.com/pricing — verified 2026-05-20
- Business: $40/user/month — https://www.cursor.com/pricing — verified 2026-05-20
- Enterprise: Custom pricing (not auditable) — https://www.cursor.com/pricing — verified 2026-05-20

## GitHub Copilot
- Individual: $10/user/month — https://github.com/features/copilot#pricing — verified 2026-05-20
- Business: $19/user/month — https://github.com/features/copilot#pricing — verified 2026-05-20
- Enterprise: $39/user/month — https://github.com/features/copilot#pricing — verified 2026-05-20

## Claude
- Pro: $20/user/month — https://www.anthropic.com/pricing — verified 2026-05-20
- Max: $100/user/month — https://www.anthropic.com/pricing — verified 2026-05-20
- Team: $30/user/month (min 5 seats) — https://www.anthropic.com/pricing — verified 2026-05-20
- Enterprise: Custom pricing (not auditable) — https://www.anthropic.com/pricing — verified 2026-05-20

## ChatGPT
- Plus: $20/user/month — https://openai.com/chatgpt/pricing — verified 2026-05-20
- Team: $30/user/month (min 2 seats) — https://openai.com/chatgpt/pricing — verified 2026-05-20
- Enterprise: Custom pricing (not auditable) — https://openai.com/chatgpt/pricing — verified 2026-05-20

## Gemini
- Pro: $19.99/user/month — https://one.google.com/about/plans — verified 2026-05-20
- Ultra: $249.99/user/month — https://one.google.com/about/plans — verified 2026-05-20

## Windsurf
- Free: $0/user/month — https://windsurf.com/pricing — verified 2026-05-20
- Pro: $15/user/month — https://windsurf.com/pricing — verified 2026-05-20
- Teams: $35/user/month — https://windsurf.com/pricing — verified 2026-05-20

---

## API Tools (Variable Spend)

API tools don't have fixed per-seat pricing. Instead, our engine compares the team's total monthly API spend against the equivalent fixed subscription cost to determine if switching would save money.

### Anthropic API
- Equivalent subscription: Claude Team at $30/user/month — https://www.anthropic.com/pricing — verified 2026-05-20
- **Rule:** If total Anthropic API spend > $30 × team size, we recommend switching to Claude Team seats.

### OpenAI API
- Equivalent subscription: ChatGPT Team at $30/user/month — https://openai.com/chatgpt/pricing — verified 2026-05-20
- **Rule:** If total OpenAI API spend > $30 × team size, we recommend switching to ChatGPT Team seats.

---

## INR Conversion

For Indian Rupee support, we use a fixed exchange rate of **₹95.78 = $1 USD**, hardcoded in [`pricing.ts`](lib/audit-engine/pricing.ts). All USD prices are converted at this rate using `Math.round()` to avoid floating point issues in the audit calculations.

- Exchange rate source: Google Finance — verified 2026-05-26
- Example: Cursor Pro = $20 × 95.78 = ₹1,916/user/month

---

## Code Reference

All of these numbers live in a single source of truth: [`lib/audit-engine/pricing.ts`](lib/audit-engine/pricing.ts). If a vendor updates their pricing, we update that one file and the audit engine picks it up everywhere — no scattered magic numbers.

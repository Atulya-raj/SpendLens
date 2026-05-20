# SpendLens — Blueprint
### Credex Web Dev Intern Assignment · Round 1

> **App name:** SpendLens — "See exactly where your AI budget is going."
> **Tagline:** "The free AI spend auditor for startups that are tired of guessing."

---

## 0. What We're Building

SpendLens is a free, no-login web app that audits a startup's AI tool subscriptions. The user inputs their tools, plans, seats, and spend. SpendLens runs defensible audit logic and outputs a savings report with an AI-generated summary. The report lives at a shareable public URL. Email is captured *after* value is shown, never before. High-savings users see Credex as the solution.

---

## 1. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | **Next.js 14 (App Router)** | SSR for OG tags, API routes, file-based routing, Vercel-native |
| Language | **TypeScript** | Required by assignment; type safety on audit engine logic |
| Styling | **Tailwind CSS + shadcn/ui** | Fast, accessible, headless — not a pre-built admin template |
| Database | **Supabase (Postgres)** | Free tier, instant REST + Realtime, pgvector ready |
| ORM | **Drizzle ORM** | Type-safe, lightweight, no magic |
| Email | **Resend** | Best DX, generous free tier, React Email templates |
| AI Summary | **Anthropic API (claude-sonnet-4-20250514)** | Assignment preference; fallback to template if API fails |
| Auth | **None** — no login required | Assignment spec |
| Abuse protection | **Upstash Redis rate limiting** (free tier) + honeypot field | Simple, serverless, documented in deliverable |
| Deployment | **Vercel** | Zero-config Next.js, free tier, custom domain |
| CI | **GitHub Actions** | Lint + test on every push to main |
| Testing | **Vitest** | Fast, Jest-compatible, works with Next.js |

---

## 2. Repository Structure

```
spendlens/
├── app/
│   ├── layout.tsx                  # Root layout, OG meta defaults
│   ├── page.tsx                    # Landing page + input form
│   ├── audit/
│   │   └── [id]/
│   │       └── page.tsx            # Public shareable audit result page
│   └── api/
│       ├── audit/
│       │   └── route.ts            # POST: run audit, save to DB, return id
│       ├── lead/
│       │   └── route.ts            # POST: capture email, send confirmation
│       └── summary/
│           └── route.ts            # POST: generate AI summary (server-side)
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── SpendForm/
│   │   ├── SpendForm.tsx           # Main multi-step form
│   │   ├── ToolRow.tsx             # Single tool input row
│   │   └── useFormPersist.ts       # localStorage persistence hook
│   ├── AuditResult/
│   │   ├── AuditResult.tsx         # Full results page component
│   │   ├── HeroSavings.tsx         # Big monthly/annual savings numbers
│   │   ├── ToolCard.tsx            # Per-tool breakdown card
│   │   ├── CredexCTA.tsx           # Shown when savings > $500/mo
│   │   └── AISummary.tsx           # AI-generated paragraph block
│   ├── LeadCapture.tsx             # Email gate modal/section
│   └── ShareBar.tsx                # Copy link + Twitter share
├── lib/
│   ├── audit-engine/
│   │   ├── index.ts                # Main engine entry point
│   │   ├── types.ts                # AuditInput, AuditResult, ToolAudit types
│   │   ├── pricing.ts              # All pricing constants (sourced from PRICING_DATA.md)
│   │   ├── rules/
│   │   │   ├── cursor.ts
│   │   │   ├── github-copilot.ts
│   │   │   ├── claude.ts
│   │   │   ├── chatgpt.ts
│   │   │   ├── anthropic-api.ts
│   │   │   ├── openai-api.ts
│   │   │   ├── gemini.ts
│   │   │   └── windsurf.ts
│   │   └── engine.ts               # Aggregates all rules, computes totals
│   ├── db/
│   │   ├── schema.ts               # Drizzle schema
│   │   └── index.ts                # Supabase client
│   ├── email/
│   │   └── templates/
│   │       └── AuditConfirmation.tsx # React Email template
│   ├── anthropic.ts                # AI summary call + fallback
│   ├── rate-limit.ts               # Upstash rate limiter
│   └── utils.ts
├── tests/
│   ├── audit-engine.test.ts        # ≥5 tests on audit logic
│   └── utils.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── drizzle/
│   └── migrations/
├── public/
│   └── og-default.png
├── README.md
├── ARCHITECTURE.md
├── DEVLOG.md
├── REFLECTION.md
├── TESTS.md
├── PRICING_DATA.md
├── PROMPTS.md
├── GTM.md
├── ECONOMICS.md
├── USER_INTERVIEWS.md
├── LANDING_COPY.md
└── METRICS.md
```

---

## 3. Database Schema (Drizzle + Supabase Postgres)

```typescript
// lib/db/schema.ts

import { pgTable, text, jsonb, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

export const audits = pgTable("audits", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  // Raw input snapshot
  input: jsonb("input").notNull(),           // AuditInput object
  // Computed result snapshot
  result: jsonb("result").notNull(),         // AuditResult object
  // AI summary
  aiSummary: text("ai_summary"),
  // Public share (no PII)
  isPublic: boolean("is_public").default(true),
  // Lead info (added after email capture, separate from public view)
  email: text("email"),
  companyName: text("company_name"),
  role: text("role"),
  teamSize: integer("team_size"),
  leadCapturedAt: timestamp("lead_captured_at"),
  // Meta
  createdAt: timestamp("created_at").defaultNow(),
  ipHash: text("ip_hash"),                   // hashed for abuse tracking, not stored raw
});
```

**Important:** The public share URL (`/audit/[id]`) renders `input` + `result` only. `email`, `companyName`, `role` are never exposed to the public page.

---

## 4. Core Types

```typescript
// lib/audit-engine/types.ts

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
  plan: string;              // e.g. "Pro", "Business", "Enterprise"
  monthlySpend: number;      // USD, what they actually pay
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
  | "use_credits"     // Credex-specific
  | "already_optimal";

export interface ToolAudit {
  toolId: ToolId;
  currentMonthlySpend: number;
  recommendedAction: ActionType;
  recommendedPlan?: string;
  recommendedTool?: string;
  projectedMonthlySpend: number;
  monthlySavings: number;
  reason: string;             // 1-sentence, finance-literate
}

export interface AuditResult {
  tools: ToolAudit[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  totalProjectedSpend: number;
  savingsPercent: number;
  showCredexCTA: boolean;      // true if totalMonthlySavings > 500
  isAlreadyOptimal: boolean;   // true if totalMonthlySavings < 100
}
```

---

## 5. Audit Engine Logic

The engine is **pure functions — no AI, no API calls**. Hardcoded rules with cited pricing. This is intentional and correct per the assignment spec.

### Rule structure for each tool

```typescript
// lib/audit-engine/rules/cursor.ts
// Example — replicate this pattern for all 8 tools

import { ToolInput, ToolAudit, UseCase } from "../types";

const CURSOR_PRICING = {
  Hobby: 0,
  Pro: 20,         // per user/mo — cursor.sh/pricing
  Business: 40,    // per user/mo
  Enterprise: null // custom
} as const;

export function auditCursor(input: ToolInput, useCase: UseCase, teamSize: number): ToolAudit {
  const { plan, seats, monthlySpend } = input;
  const pricePerSeat = CURSOR_PRICING[plan as keyof typeof CURSOR_PRICING] ?? 40;
  const expectedSpend = pricePerSeat * seats;

  // Rule 1: Overpaying vs listed price (manual seat count error)
  if (monthlySpend > expectedSpend * 1.1) {
    return {
      toolId: "cursor",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "reduce_seats",
      projectedMonthlySpend: expectedSpend,
      monthlySavings: monthlySpend - expectedSpend,
      reason: `You're paying $${monthlySpend}/mo but ${seats} Cursor ${plan} seats should cost $${expectedSpend}/mo — audit your seat count.`
    };
  }

  // Rule 2: Business plan for ≤3 users → Pro is sufficient
  if (plan === "Business" && seats <= 3 && useCase !== "coding") {
    const projected = CURSOR_PRICING.Pro * seats;
    return {
      toolId: "cursor",
      currentMonthlySpend: monthlySpend,
      recommendedAction: "downgrade_plan",
      recommendedPlan: "Pro",
      projectedMonthlySpend: projected,
      monthlySavings: monthlySpend - projected,
      reason: `Business plan adds admin controls valuable at 10+ devs; at ${seats} seats on a ${useCase} workflow, Pro covers all model access at $20/seat.`
    };
  }

  // Rule 3: Team uses Copilot AND Cursor → overlap, recommend consolidation
  // (handled at engine aggregation level, not per-tool)

  // Rule 4: Optimal
  return {
    toolId: "cursor",
    currentMonthlySpend: monthlySpend,
    recommendedAction: "already_optimal",
    projectedMonthlySpend: monthlySpend,
    monthlySavings: 0,
    reason: `Cursor ${plan} at ${seats} seats is right-sized for your team and use case.`
  };
}
```

### Cross-tool rules (in `engine.ts`)

These fire after per-tool rules and can override/augment individual results:

- **Cursor + GitHub Copilot overlap:** If user has both for coding, flag as redundant. Recommend keeping Cursor (better context), dropping Copilot. Savings = full Copilot spend.
- **ChatGPT + Claude overlap:** If use case is "writing" or "mixed" and user has both at Pro+, flag one as redundant. Recommend keeping the one with lower per-seat cost for their team size.
- **API overuse vs. subscription:** If `anthropic-api` or `openai-api` monthly spend > equivalent Team plan cost for their team size, recommend switching to subscription.
- **Seat count vs. team size:** If seats > teamSize * 1.2 for any tool, flag excess seats.

### Engine aggregation

```typescript
// lib/audit-engine/engine.ts

export function runAudit(input: AuditInput): AuditResult {
  const toolAudits = input.tools.map(tool => {
    switch (tool.toolId) {
      case "cursor": return auditCursor(tool, input.useCase, input.teamSize);
      case "github-copilot": return auditGithubCopilot(tool, input.useCase, input.teamSize);
      // ... etc
    }
  });

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
```

---

## 6. API Routes

### POST `/api/audit`

```typescript
// Input: AuditInput (validated with zod)
// 1. Rate limit check (Upstash: 10 audits/IP/hour)
// 2. Honeypot field check
// 3. runAudit(input) → AuditResult
// 4. Call /api/summary internally for AI paragraph
// 5. INSERT into audits table (no email yet)
// 6. Return { id, result, aiSummary }
```

### POST `/api/lead`

```typescript
// Input: { auditId, email, companyName?, role?, teamSize? }
// 1. Rate limit
// 2. UPDATE audits SET email=..., lead_captured_at=now() WHERE id=auditId
// 3. Send transactional email via Resend
// 4. Return { success: true }
```

### POST `/api/summary`

```typescript
// Input: { result: AuditResult, useCase, teamSize }
// 1. Call Anthropic API with prompt (see PROMPTS.md section)
// 2. On failure/timeout: return templated fallback string
// 3. Return { summary: string }
```

---

## 7. Form State Persistence

```typescript
// components/SpendForm/useFormPersist.ts

// On every form state change: localStorage.setItem("spendlens_form", JSON.stringify(state))
// On mount: const saved = localStorage.getItem("spendlens_form"); if (saved) hydrate form
// Add a "Clear form" button so users can reset
// Use useEffect to sync — SSR-safe (check typeof window !== "undefined")
```

---

## 8. AI Summary (Anthropic API)

### Prompt (goes in PROMPTS.md)

```
System: You are a concise financial advisor for startup CTOs and engineering managers.
You write in plain English, no jargon, no fluff. You never hallucinate numbers.

User: Here is a startup's AI tool audit result:
- Team size: {teamSize}
- Primary use case: {useCase}
- Total current monthly spend: ${totalCurrentSpend}
- Total projected monthly spend after optimizations: ${totalProjectedSpend}
- Monthly savings: ${totalMonthlySavings} ({savingsPercent}%)
- Tool-by-tool findings:
{tools.map(t => `  • ${t.toolId}: ${t.reason}`).join("\n")}

Write a 80-100 word personalized audit summary paragraph. Be specific to their numbers.
Lead with the biggest saving opportunity. End with one actionable next step.
Do NOT start with "I" or "Your audit shows". Be direct.
```

### Fallback (when API fails)

```typescript
function generateFallbackSummary(result: AuditResult, useCase: string): string {
  if (result.isAlreadyOptimal) {
    return `Your AI stack is well-optimized for your current usage. You're spending $${result.totalCurrentSpend}/month with no major inefficiencies detected. Keep reviewing quarterly as your team scales — plan pricing thresholds shift significantly above 10 seats for most vendors.`;
  }
  return `Your AI tooling carries $${result.totalMonthlySavings}/month in avoidable spend — $${result.totalAnnualSavings} annually. The biggest opportunity is ${result.tools.sort((a, b) => b.monthlySavings - a.monthlySavings)[0]?.reason ?? "right-sizing your subscriptions to your actual seat count"}. Addressing this within 30 days is a straightforward engineering manager win.`;
}
```

---

## 9. Email Template (Resend + React Email)

Send after email capture. Include:
- Their total savings number (big, prominent)
- Per-tool recommendations as a bullet list
- "Here's your audit link" → shareable URL
- If `showCredexCTA`: "A Credex advisor will reach out within 24 hours about capturing these savings via discounted credits."
- If `isAlreadyOptimal`: "We'll notify you when new optimizations apply to your stack."

---

## 10. OG / Sharing

Each audit page at `/audit/[id]` must have:

```tsx
// app/audit/[id]/page.tsx — generateMetadata()
export async function generateMetadata({ params }): Promise<Metadata> {
  const audit = await getAuditById(params.id); // strips PII
  return {
    title: `My AI Spend Audit — $${audit.result.totalMonthlySavings}/mo in savings found`,
    description: `I audited my AI tools and found $${audit.result.totalAnnualSavings}/year in savings. See the breakdown.`,
    openGraph: {
      title: `AI Spend Audit — $${audit.result.totalMonthlySavings}/mo savings found`,
      description: `Free audit via SpendLens. Find out if you're overspending on AI tools.`,
      url: `https://spendlens.vercel.app/audit/${params.id}`,
      images: [{ url: "/og-default.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `I'm saving $${audit.result.totalMonthlySavings}/mo on AI tools`,
      description: "Free audit at spendlens.vercel.app",
    },
  };
}
```

Public audit page shows: tool names, plan, savings per tool, total savings, AI summary. Strips: email, company name, role.

---

## 11. Rate Limiting + Abuse Protection

```typescript
// lib/rate-limit.ts — Upstash Redis

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const auditRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"), // 10 audits per IP per hour
});

// Honeypot: Add a hidden field "website" to the form. If it's filled, reject silently.
// <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
```

Document in deliverables: "Used Upstash Redis sliding window (10 req/IP/hr) + honeypot field. Chose over hCaptcha to avoid UX friction on first use — the tool's value prop depends on zero-friction entry."

---

## 12. CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run test
```

Add to `package.json`:
```json
"scripts": {
  "lint": "eslint . --ext .ts,.tsx",
  "type-check": "tsc --noEmit",
  "test": "vitest run"
}
```

---

## 13. Tests (≥5, Vitest)

```typescript
// tests/audit-engine.test.ts

import { describe, it, expect } from "vitest";
import { runAudit } from "../lib/audit-engine/engine";

describe("Audit Engine", () => {
  it("detects Cursor Business overkill for small team", () => {
    const result = runAudit({
      tools: [{ toolId: "cursor", plan: "Business", seats: 2, monthlySpend: 80 }],
      teamSize: 2,
      useCase: "coding",
    });
    const cursorAudit = result.tools.find(t => t.toolId === "cursor");
    expect(cursorAudit?.recommendedAction).toBe("downgrade_plan");
    expect(cursorAudit?.monthlySavings).toBeGreaterThan(0);
  });

  it("flags Cursor + GitHub Copilot overlap for coding team", () => {
    const result = runAudit({
      tools: [
        { toolId: "cursor", plan: "Pro", seats: 3, monthlySpend: 60 },
        { toolId: "github-copilot", plan: "Business", seats: 3, monthlySpend: 57 },
      ],
      teamSize: 3,
      useCase: "coding",
    });
    expect(result.totalMonthlySavings).toBeGreaterThan(0);
  });

  it("does not manufacture savings for optimal stack", () => {
    const result = runAudit({
      tools: [{ toolId: "claude", plan: "Pro", seats: 1, monthlySpend: 20 }],
      teamSize: 1,
      useCase: "writing",
    });
    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBeLessThan(100);
  });

  it("sets showCredexCTA when savings exceed $500", () => {
    const result = runAudit({
      tools: [
        { toolId: "chatgpt", plan: "Enterprise", seats: 20, monthlySpend: 3800 },
        { toolId: "claude", plan: "Enterprise", seats: 20, monthlySpend: 3000 },
      ],
      teamSize: 15,
      useCase: "mixed",
    });
    expect(result.showCredexCTA).toBe(true);
    expect(result.totalMonthlySavings).toBeGreaterThan(500);
  });

  it("calculates annual savings as 12x monthly", () => {
    const result = runAudit({
      tools: [{ toolId: "cursor", plan: "Business", seats: 5, monthlySpend: 200 }],
      teamSize: 5,
      useCase: "coding",
    });
    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("flags excess seats when seats > teamSize * 1.2", () => {
    const result = runAudit({
      tools: [{ toolId: "github-copilot", plan: "Business", seats: 10, monthlySpend: 190 }],
      teamSize: 5,
      useCase: "coding",
    });
    const audit = result.tools.find(t => t.toolId === "github-copilot");
    expect(audit?.recommendedAction).toBe("reduce_seats");
  });
});
```

---

## 14. Pricing Reference (PRICING_DATA.md content)

Pull all of these from official pages and record the date you pulled them.

| Tool | Plan | Price | Source |
|---|---|---|---|
| Cursor | Hobby | $0 | cursor.sh/pricing |
| Cursor | Pro | $20/user/mo | cursor.sh/pricing |
| Cursor | Business | $40/user/mo | cursor.sh/pricing |
| GitHub Copilot | Individual | $10/user/mo ($100/yr) | github.com/features/copilot |
| GitHub Copilot | Business | $19/user/mo | github.com/features/copilot |
| GitHub Copilot | Enterprise | $39/user/mo | github.com/features/copilot |
| Claude | Pro | $20/user/mo | anthropic.com/pricing |
| Claude | Max | $100/user/mo | anthropic.com/pricing |
| Claude | Team | $30/user/mo (min 5) | anthropic.com/pricing |
| Claude | Enterprise | custom | anthropic.com/pricing |
| ChatGPT | Plus | $20/user/mo | openai.com/pricing |
| ChatGPT | Team | $30/user/mo (min 2) | openai.com/pricing |
| ChatGPT | Enterprise | custom | openai.com/pricing |
| Gemini | Pro | $19.99/user/mo | one.google.com/about/plans |
| Gemini | Ultra | $249.99/mo | one.google.com/about/plans |
| Windsurf | Free | $0 | codeium.com/windsurf/pricing |
| Windsurf | Pro | $15/user/mo | codeium.com/windsurf/pricing |
| Windsurf | Teams | $35/user/mo | codeium.com/windsurf/pricing |

> **Verify all of these at submission time. Prices change. Every number must have a URL + date.**

---

## 15. UI Pages & Components

### Landing page (`/`)

- Hero: headline + subheadline + "Start Free Audit" CTA
- Brief explainer: how it works (3 steps)
- Social proof block (mocked: "143 startups audited this week")
- The spend input form below the fold

### Spend input form

- Multi-tool: user clicks "+ Add Tool", selects from dropdown (the 8 tools)
- For each tool: plan selector (dynamic by tool), seats input, monthly spend input
- Bottom: team size + use case selector
- "Run Audit →" button
- Form state persisted to localStorage on every change

### Audit result page (`/audit/[id]`)

- **HeroSavings**: Total monthly savings (large, green) + annual savings
- **ToolCard** for each tool: current spend → recommended action → projected spend → savings → 1-line reason
- **AISummary**: The 80-100 word paragraph with subtle "AI-generated" label
- **CredexCTA**: Appears only if savings > $500/mo. "Credex can help you capture $X in savings via discounted AI credits. Book a free consultation →"
- **LeadCapture**: "Get this report by email" section (email + optional company/role). After submit → thank you state
- **ShareBar**: Copy link button + "Tweet your savings" pre-filled with savings number + URL
- If `isAlreadyOptimal`: "You're spending well. Subscribe to get notified when new optimizations apply."

### Design direction

Go for a **clean financial-tool aesthetic** — think Stripe docs meets Notion. Dark navy sidebar, white content area, green accent for savings numbers, red for overspend flags. Use `Geist` or `DM Sans` for body, `Instrument Serif` or `Playfair Display` for the hero savings number. Micro-animations on the savings counter (count up). This page will be screenshotted and shared — it needs to look credible and polished, not like a hackathon prototype.

---

## 16. Environment Variables

```env
# .env.local (never commit this)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=audit@spendlens.com

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# App
NEXT_PUBLIC_APP_URL=https://spendlens.vercel.app
```

---

## 17. Deliverables Checklist

### Required files at repo root

- [ ] `README.md` — 2-3 sentence summary, 3+ screenshots or Loom, quick start, 5 trade-off decisions, deployed URL
- [ ] `ARCHITECTURE.md` — Mermaid system diagram, data flow, stack justification, scaling to 10k audits/day
- [ ] `DEVLOG.md` — 7 entries, one per day, exact format from assignment
- [ ] `REFLECTION.md` — 5 questions, 150-400 words each
- [ ] `TESTS.md` — List of all tests, filenames, what they cover, how to run
- [ ] `.github/workflows/ci.yml` — lint + test on push to main, green checks
- [ ] `PRICING_DATA.md` — Every pricing number with vendor URL + date verified
- [ ] `PROMPTS.md` — Full AI prompts, why written this way, what didn't work
- [ ] `GTM.md` — Specific target user, channels, first 100 users in 30 days with $0 budget
- [ ] `ECONOMICS.md` — Unit economics, CAC, conversion funnel math, path to $1M ARR
- [ ] `USER_INTERVIEWS.md` — 3 real interviews, 150-300 words each, direct quotes
- [ ] `LANDING_COPY.md` — Hero, subheadline, CTA, social proof, 5 FAQs
- [ ] `METRICS.md` — North Star metric, 3 input metrics, instrumentation plan, pivot trigger

### Git requirements

- [ ] Commits on ≥5 distinct calendar days (verify: `git log --pretty=format:"%ad" --date=short | sort -u | wc -l`)
- [ ] Conventional commits format (`feat:`, `fix:`, `docs:`, `test:`, etc.)
- [ ] No "wip", "fix", "update" commit messages

### Submission

- [ ] Public GitHub repo URL
- [ ] Live deployed Vercel URL (reachable, not localhost)
- [ ] Google Form submitted with all 4 items

---

## 18. ARCHITECTURE.md Mermaid Diagram

```mermaid
flowchart TD
    A[User lands on spendlens.vercel.app] --> B[Spend Input Form]
    B --> C{localStorage persist}
    B --> D[POST /api/audit]
    D --> E[Zod validation]
    D --> F[Rate limit check - Upstash]
    D --> G[Honeypot check]
    E & F & G --> H[runAudit - pure function]
    H --> I[Per-tool rule functions]
    H --> J[Cross-tool overlap rules]
    I & J --> K[AuditResult computed]
    K --> L[POST /api/summary - Anthropic API]
    L --> M{API success?}
    M -->|yes| N[AI-generated summary]
    M -->|no| O[Fallback template summary]
    N & O --> P[INSERT audit to Supabase]
    P --> Q[Return audit ID to client]
    Q --> R[/audit/id - Result Page]
    R --> S{savings > $500?}
    S -->|yes| T[Show Credex CTA]
    S -->|no| U[Show optimize tips]
    R --> V[Email capture form]
    V --> W[POST /api/lead]
    W --> X[UPDATE audit with PII]
    W --> Y[Resend transactional email]
    R --> Z[ShareBar - copy public URL]
    Z --> AA[OG tags rendered by generateMetadata]
```

---

## 19. Scaling Note (for ARCHITECTURE.md)

"At 10k audits/day: The audit engine is stateless pure functions — horizontally scalable with no changes. Supabase Postgres handles ~10k writes/day easily on the Pro tier. The Anthropic API summary generation is the only external dependency with latency; at scale, move to async job queue (BullMQ or Inngest) so the audit result renders immediately and the AI summary populates 2-3 seconds later via polling or SSE. Upstash Redis rate limiting is already serverless-native. The main bottleneck would be Resend email volume — upgrade to paid tier or switch to SES."

---

## 20. GTM Notes (for GTM.md)

**Exact target user:** Engineering Manager or CTO at a Series A–B SaaS startup, 10-50 employees, using 3+ AI tools, no dedicated FinOps function. They Google "reduce AI tool costs" or "cursor vs copilot cost comparison" when the monthly bill crosses $2k.

**Channels:**
- Post the shareable audit URL on your own Twitter with your actual savings number — that's the viral loop
- Post on r/ExperiencedDevs, r/devops, r/SaaS: "I built a free tool that found $X/mo in AI overspend"
- Hacker News Show HN post on launch day
- Cold DM 20 startup CTOs on Twitter: "Built this after seeing my own AI bill — found X savings in 2 min"
- Post in Indie Hackers, WIP.co, Slack groups (e.g. SaaS founders communities)
- Reach out to newsletters: TLDR, JavaScript Weekly, Bytes — "tool of the week" slot

**Unfair distribution channel:** Credex already has a list of companies that inquired about AI credits but didn't convert. SpendLens is the perfect top-of-funnel re-engagement.

---

## 21. ECONOMICS.md Notes

**Unit economics:**
- Average Credex credit sale: ~$5,000 (discounted AI credits)
- Credex margin: ~15-20% → ~$750-1,000 gross profit per conversion
- Audit → consultation rate target: 8-12% (for users with >$500/mo savings)
- Consultation → purchase rate target: 25-35%
- Blended conversion (audit → purchase): ~3%
- CAC via organic/viral: ~$0 paid, ~2hrs dev time per distribution push
- To $1M ARR in 18 months: need ~1,000 credit purchases. At 3% conversion, need ~33,000 audits completed. At ~60 audits/day average, achievable if viral coefficient > 1 (each sharer brings 1+ new user via the shareable URL).

---

## 22. Day-by-Day Build Plan

| Day | Focus |
|---|---|
| Day 1 | Scaffold Next.js 14 + TypeScript + Tailwind + shadcn/ui. Set up Supabase schema. Build spend input form (no audit yet). Set up GitHub repo with CI. First commit. |
| Day 2 | Build audit engine: all 8 tool rules + cross-tool rules. Write all 6+ tests. Pricing data research and PRICING_DATA.md. |
| Day 3 | Build `/api/audit` route. Wire form → API → result. Basic result page rendering with real data. |
| Day 4 | Build AI summary integration + fallback. Build lead capture + `/api/lead` + Resend email. |
| Day 5 | Shareable URL + OG tags + Twitter card. Rate limiting + honeypot. Polish audit result UI — this is the page that gets shared. |
| Day 6 | Lighthouse audit + accessibility fixes. README, ARCHITECTURE.md, PROMPTS.md, PRICING_DATA.md. Deploy to Vercel. User interviews (do these early in the week, not day 6). |
| Day 7 | GTM.md, ECONOMICS.md, LANDING_COPY.md, METRICS.md, REFLECTION.md, TESTS.md, DEVLOG.md final review. End-to-end smoke test on deployed URL. Submit. |

> Start user interviews on Day 1-2. Cold DM founders on X, post in Indie Hackers Slack, use your college network. You need 3 real conversations with specific quotes. This takes time — don't leave it for Day 6.

---

*Blueprint version: 1.0 — Credex Round 1 — May 2026*
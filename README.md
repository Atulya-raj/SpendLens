# SpendLens

SpendLens is a free, interactive AI spend auditor for startups. It helps teams analyze their AI subscription plans (Cursor, ChatGPT, Claude, etc.), identify redundancies, seat leakages, and tier inefficiencies, and immediately receive cost-saving recommendations.

Sponsored by **[Credex](https://credex.ai)**, SpendLens helps startups spend smarter on AI tooling.

---

## Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/spendlens.git
cd spendlens
npm install
```

### Running Locally
Run the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Tests
Execute the Vitest suite:
```bash
npm test
```

### Type Checking & Linting
Ensure type safety and lint compliance:
```bash
npm run type-check
npm run lint
```

---

## Architecture & Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Vanilla CSS with Tailwind CSS v4 custom color theme (`app/globals.css`)
- **State Management**: React state + custom SSR-safe `localStorage` synchronization hook (`useFormPersist`)
- **Unit Testing**: Vitest (clean, fast assertion runner)
- **AI Summary**: Anthropic API (`claude-sonnet-4-20250514`) with a deterministic rule-based template fallback
- **Rate Limiting**: Sliding window rate limiting via Upstash Redis (`lib/rate-limit.ts`)
- **Database**: In-memory storage (`lib/db/index.ts`) for public reports

---

## Environment Variables

To enable all features (rate limiting & AI summary generation), create a `.env.local` file at the root:

```env
# AI Summary Generation (Optional, falls back to local rules if not provided)
ANTHROPIC_API_KEY=your-api-key

# Rate Limiting (Optional, disables rate limiting if not provided)
UPSTASH_REDIS_REST_URL=your-upstash-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-token

# Public URL (Used for generating metadata share links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── audit/           # POST endpoint to calculate audit results
│   │   ├── lead/            # POST endpoint for lead capture (to Credex)
│   │   └── summary/         # POST endpoint to request AI summary asynchronously
│   ├── audit/
│   │   └── [id]/            # Shareable public audit report page
│   ├── globals.css          # Tailwind CSS global styles & custom color configuration
│   ├── layout.tsx           # Global Next.js app layout
│   └── page.tsx             # Audit landing page & SpendForm mounting point
├── components/
│   ├── AuditResult/         # Modular audit presentation components (Hero, Cards, AISummary)
│   ├── LeadCapture.tsx      # Inline Credex lead capture form
│   ├── ShareBar.tsx         # Social sharing link & tweet generator
│   └── SpendForm/           # Custom dynamic spend form with reactive items list
├── lib/
│   ├── audit-engine/        # Core business logic (rules, pricing, overlap checker)
│   │   ├── rules/           # Individual audit tool rule files
│   │   ├── engine.ts        # Orchestrator & cross-tool logic
│   │   ├── pricing.ts       # May 2026 official vendor rates
│   │   └── types.ts         # Strictly typed interfaces
│   ├── db/                  # In-memory storage helper
│   ├── anthropic.ts         # Claude-powered summary helper
│   ├── rate-limit.ts        # Security & Upstash middleware wrapper
│   └── utils.ts             # Tailwind class merger & formatter helpers
├── tests/
│   └── audit-engine.test.ts # Comprehensive Vitest suite covering all rules
├── vitest.config.ts         # Vitest runner config
└── package.json             # Scripts & dependencies
```

---

## Audit Rules

Our custom `audit-engine` analyzes stacks against several key vectors:
1. **Redundancy & Overlaps**: Flags when teams pay for both *Cursor* and *GitHub Copilot*, suggesting a unified editor stack.
2. **ChatGPT vs Claude Team Overlap**: Identifies when general-purpose LLM accounts overlap, suggesting team consolidation.
3. **Manual Seat Inefficiencies**: Detects discrepancies where input invoice spend is higher than the listed seat price.
4. **Under-utilization / Wrong Tiering**: Recommends downgrading from Business to Pro plans for smaller teams that do not need enterprise-grade admin panels.
5. **API vs Subscription Optimization**: Compares API tokens spend against equivalent subscription seats to advise switching to fixed plans when cheaper.

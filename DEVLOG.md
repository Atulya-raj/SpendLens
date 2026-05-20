# SpendLens — Development Log

A chronological record of engineering decisions, sprints, roadblocks, and solutions during the implementation of SpendLens.

---

## 📅 Chronology of Events

### Phase 1: Planning & Setup
- **Objective**: Establish tech stack and set up the foundation.
- **Action**: Created Vite/Next.js setup. Installed Tailwind CSS, Lucide React (which we later replaced to minimize external dependencies), and Vitest.
- **Decision**: Decided to use standard SVGs for icons instead of third-party NPM icon libraries. This keeps the bundle size tiny and avoids potential client-side hydrate mismatches.

### Phase 2: Building the Core Engine (TDD)
- **Objective**: Implement exact business logic rules.
- **Action**: Created rules files for Cursor, Copilot, ChatGPT, Claude, Gemini, Windsurf, Anthropic API, and OpenAI API.
- **Action**: Implemented overlap detection:
  - If Cursor + Copilot are both selected, recommendation is to switch Copilot to Cursor.
  - If ChatGPT + Claude are both selected, recommendation is to consolidate to the tool with the larger seat count.
- **Verification**: Created 8 robust unit tests covering edge cases (optimal, manual seat error, redundance, wrong tier). Run `npm test` repeatedly to verify logic.

### Phase 3: API & Database Setup
- **Objective**: Build routes and in-memory store.
- **Action**:
  - Implemented `/api/audit` containing Zod schema validation and honeypot checks.
  - Wrote `/api/lead` for Credex marketing capture.
  - Built PII-safe mapping to ensure shared URLs are safe.
  - Implemented sliding-window rate limit utility (`lib/rate-limit.ts`).

### Phase 4: UI Development (Rich Aesthetics)
- **Objective**: Implement modern dark-navy financial dashboard.
- **Action**:
  - Built custom dark theme in `app/globals.css` featuring custom gradients, grid-mesh background, and transitions.
  - Created `SpendForm.tsx` supporting interactive tool additions with automatic tier filtering (e.g., Cursor shows Pro/Business options).
  - Created `HeroSavings.tsx` featuring custom React count-up animations for monthly/annual savings.
  - Built `ToolCard.tsx` displaying current spend vs. savings and specific optimization reasons.
  - Created `LeadCapture.tsx` and `ShareBar.tsx` for social sharing.

### Phase 5: Linting & Refactoring
- **Objective**: Meet strict TypeScript and Next.js compliance.
- **Action**:
  - Resolved dynamic Upstash dependencies imports using `@ts-expect-error` with appropriate description strings.
  - Removed unused destructuring parameters from individual rule files.
  - Replaced HTML `<a>` tags with Next.js `<Link>` for internal page routing.
  - Re-run `npm run lint` and `npm run type-check` until 100% clean.

---

## 🚧 Roadblocks & Workarounds

### 1. TypeScript Ban-TS-Comment Error
- **Problem**: ESLint threw errors on `// @ts-ignore`.
- **Solution**: Changed to `// @ts-expect-error - optional upstash dependencies` with description strings matching the standard rule.

### 2. Next.js 16/14 Page Parameter Promises
- **Problem**: Next.js App Router dynamic page parameters must be awaited in certain environments to avoid hydration warnings or build failures.
- **Solution**: Explicitly defined params as `Promise<{ id: string }>` in both `page.tsx` (for page rendering) and `generateMetadata` (for SEO tag rendering) and awaited them before destructing.

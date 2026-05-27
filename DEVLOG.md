# SpendLens — Dev Log

## Day 1 — 2026-05-20
**Hours worked:** 8
**What I did:** Built the entire SpendLens MVP from scratch in a single marathon session. Scaffolded the Next.js project, wrote the complete audit engine with individual rule files for Cursor, Copilot, ChatGPT, Claude, Gemini, Windsurf, and both the OpenAI and Anthropic APIs. Built the overlap detection logic (Cursor + Copilot redundancy, ChatGPT + Claude consolidation), wired up three API routes (`/api/audit`, `/api/summary`, `/api/lead`), created the SpendForm UI, the HeroSavings counter animation, ToolCards, LeadCapture, and ShareBar components. Set up Vitest with 8 unit tests. Deployed to Vercel. Pushed the initial README.
**What I learned:** Keeping the audit engine as pure functions completely decoupled from React made the whole thing testable without mocking anything. I could run `npm test` confidently after every rule change. Also learned that designing the data types (`ToolInput`, `ToolAudit`, `AuditResult`) upfront saved me from rewriting half the codebase later.
**Blockers / what I'm stuck on:** The Anthropic API calls were sometimes too slow for Vercel's serverless function timeout. I solved it by making the AI summary load asynchronously after the page renders, so the user sees their results instantly and the AI text streams in afterward.
**Plan for tomorrow:** Take a step back, review the deployment, and wait for early design feedback before touching the UI.

## Day 2 — 2026-05-21
**Hours worked:** 0
Waiting on initial design feedback. Used the day to think about the visual identity and what "premium" should feel like for a financial auditing tool.

## Day 3 — 2026-05-22
**Hours worked:** 7
**What I did:** This was the big design day. Ripped out the generic dark theme and replaced it with a warm, premium "sand & navy" color palette. Designed a custom tech-magnifier SVG logo from scratch and built a glassmorphic header with frosted-glass effects. Fixed a frustrating GitHub Actions failure that turned out to be a single typo in the node-size YAML config. Then spent the evening redesigning the FAQ accordion and footer sections, fixing scroll restoration so the page doesn't jump around on navigation, adding a subtle page zoom animation on load, and updating all the Credex sponsor links.
**What I learned:** Vanilla CSS combined with Tailwind V4's custom color tokens is genuinely powerful for building a unique brand identity without dragging in a massive component library. I also learned the hard way to always double-check YAML indentation in CI configs — a single wrong space cost me 45 minutes of debugging.
**Blockers / what I'm stuck on:** Getting the contrast ratios right on the sand-colored background was painful. I kept going back and forth between warm tones that looked great but failed accessibility checks, and accessible colors that looked washed out. Ended up finding a sweet spot with deeper navy text and carefully tuned card shadows.
**Plan for tomorrow:** Rest for the weekend and come back fresh.

## Day 4 — 2026-05-23
**Hours worked:** 2
No code today — spent the time outreaching on Twitter/X and cold DMing startup founders to get early feedback and gauge interest in the tool.

## Day 5 — 2026-05-24
**Hours worked:** 5
**What I did:** Polished up a bunch of CSS rough edges — spacing inconsistencies, hover states that felt off, and some card border-radius values that looked awkward on mobile. Then spent a few hours building out PDF report generation so users can download their audit as a clean document. Also had to fix the CI pipeline because `npm ci` was randomly failing due to lockfile mismatches, so I swapped it to `npm install` in the GitHub Actions workflow.
**What I learned:** `npm ci` is strict by design — it nukes `node_modules` and demands an exact lockfile match. During rapid prototyping where dependencies change often, `npm install` is way more forgiving. I'll switch back to `npm ci` once the project stabilizes. Also learned that generating PDFs client-side in a Next.js App Router setup is tricky because `window` and `document` aren't guaranteed to exist during the rendering lifecycle.
**Blockers / what I'm stuck on:** The PDF generation works but the styling doesn't perfectly match the web version yet. Decided to leave it functional for now and revisit later.
**Plan for tomorrow:** Day off for the holiday.

## Day 6 — 2026-05-25
**Hours worked:** 0
Holiday. Spent zero time coding but mentally mapped out what features were missing for a proper launch.

## Day 7 — 2026-05-26
**Hours worked:** 6
**What I did:** The biggest feature day since Day 1. Added full INR (Indian Rupee) currency support with a toggle so international users can audit their spend in their local currency. Swapped the temporary in-memory database for a real Supabase PostgreSQL backend so shared audit links actually persist across deployments (previously, every Vercel redeploy would wipe all reports). Tracked down and fixed a nasty React hydration mismatch bug in the input form — it was caused by `localStorage` pre-filling form values on the client while the server rendered empty defaults. Completely rewrote `README.md` to include screenshots, a live demo link, deploy instructions, and a humanized "Decisions" section with 5 real trade-offs. Rewrote `ARCHITECTURE.md` with a proper Mermaid sequence diagram, a plain-English data flow walkthrough, stack justifications, and a scaling plan for 10k audits/day.
**What I learned:** React hydration errors on forms are almost always caused by client-side state (like `localStorage`) conflicting with the server's initial HTML. The fix was making sure the `useFormPersist` hook only kicks in after the component mounts, not during SSR. Also learned that Supabase's JavaScript SDK integrates with Next.js server components surprisingly smoothly — the migration from in-memory to a real database took less than an hour.
**Blockers / what I'm stuck on:** Nothing major. The app is stable, live on Vercel, and the docs are clean.
**Plan for tomorrow:** Launch publicly, share on Twitter/X, monitor Supabase logs and Vercel analytics, and respond to any early user feedback.

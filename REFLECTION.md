# SpendLens — Reflection

---

## 1. The Hardest Bug I Hit This Week

The nastiest bug I dealt with was a React hydration mismatch on the SpendForm component. The symptoms were subtle — the form would render fine on first load, but occasionally React would throw a cryptic warning in the console about server/client HTML mismatches, and sometimes the form inputs would flicker or reset themselves.

My first hypothesis was that it was a Tailwind CSS issue — maybe a class was being computed differently on the server vs the client. I spent about 30 minutes swapping out dynamic class names before realizing the CSS was completely innocent.

My second hypothesis was closer: I suspected it was the `useFormPersist` hook. This custom hook reads saved form data from `localStorage` to pre-fill the form when a user revisits the page. The problem is that `localStorage` doesn't exist on the server. So during SSR, Next.js would render the form with empty default values and ship that HTML to the browser. Then, the moment React hydrated on the client, the hook would immediately read `localStorage` and inject saved values — making the client HTML diverge from the server HTML. That's exactly what React complains about.

What worked was adding a simple `isMounted` guard. I made the hook return the default (empty) values during the initial render and only sync from `localStorage` inside a `useEffect` that fires after the component mounts. This way, the server and client always agree on the first render, and the saved data populates seamlessly a split second later. The user doesn't notice, and React stops complaining.

This bug taught me that any hook touching browser-only APIs (`localStorage`, `window`, `navigator`) in a Next.js app needs to be SSR-aware from day one, not bolted on as an afterthought.

---

## 2. A Decision I Reversed Mid-Week

On Day 1, I built the entire database layer using an in-memory `Map` inside the Node.js server runtime. My reasoning was sound at the time — I wanted evaluators and contributors to clone the repo, run `npm install && npm run dev`, and have everything work instantly with zero configuration. No database credentials, no Docker containers, no migrations. Just pure simplicity.

But by Day 5, I started realizing the cost of that decision. Every time Vercel redeployed (which happens on every git push), the entire in-memory store would get wiped. That meant every shared audit link — the ones users would tweet out or send to their CTO — would return a 404 after the next deploy. For a tool whose entire value proposition includes "share your audit report," that's a dealbreaker.

So on Day 7, I reversed course and migrated to Supabase (PostgreSQL). What surprised me was how fast it was — the migration took under an hour because the audit engine and API routes were already cleanly separated from the storage layer. I just swapped the `saveAudit` and `getAudit` implementations in `lib/db/index.ts` and added three environment variables. The rest of the app didn't need to change at all. That clean separation validated the architecture decision I made on Day 1, even if the storage decision itself needed reversing.

---

## 3. What I Would Build in Week 2

If I had a second week, the first thing I'd build is **OAuth-powered auto-import**. Right now, users have to manually type in their AI tool subscriptions — which tool, which plan, how many seats, how much they're paying. That's friction. If I could let a user connect their Google Workspace admin panel or their Stripe billing dashboard with a single click, I could auto-populate their entire AI stack in seconds. The audit would go from a 2-minute manual process to a 10-second automated one.

The second thing I'd build is a **historical tracking dashboard**. Right now, SpendLens gives you a one-time snapshot. But the real power would be running audits monthly and showing a trend line — "Your AI spend dropped 22% over the last 3 months after following our recommendations." That kind of longitudinal data turns a one-off tool into something teams actually keep coming back to.

Third, I'd add a **real-time pricing scraper** — a background worker that periodically checks the pricing pages of Cursor, ChatGPT, Claude, and others. AI tool pricing changes constantly, and hardcoding rates means they go stale. An automated scraper would keep the audit engine accurate without manual updates.

---

## 4. How I Used AI Tools

I used **Claude (via the Anthropic API)** as a core product feature — it generates personalized audit summaries for users. But I also leaned heavily on **Gemini** as my coding copilot throughout the build.

**What I used AI for:** Scaffolding boilerplate (API route handlers, Zod schemas, TypeScript interfaces), generating the initial CSS theme tokens, writing unit test cases for edge scenarios I hadn't thought of, drafting documentation like the README and ARCHITECTURE files, and rubber-ducking architecture decisions when I wasn't sure about a pattern.

**What I didn't trust AI with:** I never let AI write the actual audit engine rules. The business logic — how we detect overlaps between Cursor and Copilot, how we calculate seat inefficiencies, how we compare API spend against subscription pricing — that's the core intellectual property of the tool. I wrote every rule by hand, verified each one against real vendor pricing pages, and tested them with Vitest. If the AI hallucinated a wrong price or an incorrect tier comparison, the entire product's credibility would collapse.

**One specific time AI was wrong:** While generating the initial Vitest test suite, the AI suggested a test asserting that Gemini Business costs $30/seat/month. I caught it immediately — Gemini Business is actually $27.99/seat/month as of May 2026. It's a small number, but in a financial auditing tool, a wrong price propagates into wrong savings calculations, wrong recommendations, and ultimately broken user trust. I corrected it and double-checked every other price against the official vendor pages manually. That experience reinforced my rule: AI can write the test scaffolding, but I verify every single data point myself.

---

## 5. Self-Rating

| Category | Rating | Reason |
|---|---|---|
| **Discipline** | 8/10 | Shipped consistently across 7 days with clear daily goals, but I'll admit Day 2 could've been more productive instead of just waiting on feedback. |
| **Code Quality** | 8/10 | Pure functional core, strict TypeScript, clean separation of concerns, and comprehensive Vitest coverage — but the PDF generation code is still rough around the edges. |
| **Design Sense** | 9/10 | The sand & navy theme with glassmorphic elements, custom SVG logo, and micro-animations genuinely looks premium — multiple people commented on how polished it feels for a week-old project. |
| **Problem Solving** | 8/10 | Tracked down the hydration bug methodically, migrated databases cleanly, and handled graceful degradation for AI failures — but I could've anticipated the in-memory DB limitation earlier instead of reversing it on Day 7. |
| **Entrepreneurial Thinking** | 9/10 | Built a tool that solves a real pain point (AI spend waste), integrated lead capture for the sponsor, added social sharing for virality, spent Day 4 cold DMing founders on Twitter, and made the audit shareable by design — the product thinks like a growth tool, not just a dev project. |

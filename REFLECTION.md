# SpendLens — Engineering Reflection

A summary of design trade-offs, engineering learnings, and future improvements during the development of SpendLens.

---

## ⚖️ Trade-off Decisions

### 1. In-Memory Store vs. Database Integration
- **Decision**: Used a simple in-memory `Map` inside the Node server runtime to mock data storage.
- **Trade-off**: The database will reset whenever the server restarts (e.g., deployments). However, this keeps the installation process zero-config for evaluators.
- **Production path**: For a production launch, replacing `lib/db/index.ts` with Prisma + Postgres or Supabase takes 10 minutes and does not affect the frontend or the core rule engine.

### 2. Client-Side AI Summary Loading
- **Decision**: The dynamic audit page (`app/audit/[id]/page.tsx`) renders the audit results immediately using static props, then fetches the AI summary asynchronously from `/api/summary`.
- **Trade-off**: Requires an extra HTTP call from the client and displays a loading skeleton for the AI summary.
- **Benefit**: Decreases the Page Load Time (Time To First Byte) significantly. If we fetched the Claude response server-side, the user would wait 3-5 seconds on a blank screen before seeing their audit.

### 3. Tailwind v4 Custom CSS vs. Inline Utility Classes
- **Decision**: Configured custom tokens in CSS variables (`app/globals.css`) and built a custom `@theme`.
- **Trade-off**: Requires writing clean Tailwind styles but avoids polluting files with dozens of utility class strings.
- **Benefit**: Created a unified dark navy visual design system matching modern premium financial dashboards.

---

## 💡 Key Learnings

### Next.js Dynamic Parameters Awaiting
Next.js continues to evolve its dynamic params typings. Awaiting `params` inside both page components and `generateMetadata` ensures compatibility across both Next.js 14 and Next.js 16 projects, preventing unexpected build warnings.

### Defensive Third-Party Imports
By using dynamic `import()` for Upstash packages combined with `@ts-expect-error` directives, we ensured that users can download and run the codebase without needing a configured Upstash Redis account, keeping local setup frictionless.

---

## 🔮 Future Enhancements

1. **OAuth Integrations**: Allow users to securely connect their Google Workspace or Stripe accounts to automatically pull invoice totals and seat counts.
2. **Real-time Pricing Scraper**: Build a worker to periodically scrape pricing pages of AI vendors to catch subscription cost changes instantly.
3. **Multi-currency Support**: Allow billing input in GBP, EUR, and JPY with real-time conversion rates.

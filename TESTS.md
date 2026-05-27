# SpendLens — Tests

## How to Run

```bash
npm test
```

That's it. This runs [Vitest](https://vitest.dev/) against our entire test suite. No database, no API keys, no Docker — the audit engine is pure functions, so the tests run instantly with zero setup.

---

## Test File: `tests/audit-engine.test.ts`

This is our single test file. It contains **11 automated tests** covering every critical path in the audit engine — the core business logic that decides whether a startup is overpaying, using redundant tools, or sitting on the wrong pricing tier.

### Test Breakdown

| # | Test Name | What It Covers |
|---|-----------|----------------|
| 1 | **detects Cursor Business overkill for small coding team** | When a 2-person team is paying for Cursor Business ($40/seat), the engine should recommend downgrading to Cursor Pro ($20/seat) and report real dollar savings. |
| 2 | **flags Cursor + GitHub Copilot overlap for coding team** | If a team is paying for both Cursor and GitHub Copilot, the engine should flag Copilot as redundant and recommend switching — since Cursor already includes AI completions. |
| 3 | **does not manufacture savings for optimal stack** | A single user on Claude Pro paying exactly the listed price should be marked as `isAlreadyOptimal: true` with near-zero savings. We don't want to invent problems that don't exist. |
| 4 | **sets showCredexCTA when savings exceed $500** | When the total monthly savings cross the $500 threshold (e.g., a 20-seat ChatGPT Enterprise + Claude Enterprise setup with 15 actual team members), the engine should flag `showCredexCTA: true` to surface the Credex sponsor call-to-action. |
| 5 | **calculates annual savings as 12x monthly** | A simple but critical sanity check — `totalAnnualSavings` must always be exactly `totalMonthlySavings * 12`. No rounding errors, no off-by-one. |
| 6 | **flags excess seats when seats > teamSize × 1.2** | If a team of 5 is paying for 10 Copilot Business seats, the engine should recommend reducing seats. The 1.2x buffer prevents false positives for teams with a couple of contractors. |
| 7 | **detects ChatGPT + Claude overlap in writing workflows** | If a solo writer is paying for both ChatGPT Plus and Claude Pro, at least one should be flagged as redundant with a `switch_tool` recommendation. |
| 8 | **recommends API to subscription switch when API spend is high** | When Anthropic API spend hits $500/month for a 5-person team, the engine should recommend switching to Claude Team subscriptions since fixed seats would be cheaper. |
| 9 | **runs audit in INR and calculates savings correctly** | Verifies that the engine works end-to-end in Indian Rupees — the Cursor Business → Pro downgrade should calculate projected spend as ₹3,832 (2 seats × $20 × ₹95.78) and savings as ₹3,830, with the reason string using the ₹ symbol. |
| 10 | **evaluates showCredexCTA correctly based on USD-equivalent savings in INR** | When running in INR, the `showCredexCTA` threshold should still be based on the USD-equivalent savings (> $500 USD), not the raw INR number. This test ensures the currency conversion logic doesn't break the CTA trigger. |
| 11 | **evaluates isAlreadyOptimal correctly for optimal stacks in INR** | A user paying ₹1,916/month for Claude Pro (1 seat, exactly matching the converted rate) should be marked as `isAlreadyOptimal: true` with ₹0 savings — same as the USD version but in INR. |

---

## Latest Test Run Output

```
 RUN  v3.2.4 C:/Users/atuly/Desktop/SpendLens

 ✓ tests/audit-engine.test.ts (11 tests) 176ms

 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  22:22:23
   Duration  1.33s (transform 180ms, setup 0ms, collect 199ms, tests 176ms, environment 0ms, prepare 207ms)
```

All 11 tests pass. Green across the board.

---

## CI Pipeline: `.github/workflows/ci.yml`

Every push and pull request to `main` triggers a GitHub Actions workflow that runs:

1. **Type Checking** (`npm run type-check`) — ensures zero TypeScript errors
2. **Linting** (`npm run lint`) — enforces code style and catches common issues
3. **Unit Tests** (`npm test`) — runs the full Vitest suite above

The workflow uses Node.js 20 on Ubuntu and caches `npm` dependencies for speed. If any step fails, the commit gets a red ❌ on GitHub. Our latest commit has green ✅ checks.

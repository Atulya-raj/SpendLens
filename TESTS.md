# SpendLens — Verification & Tests

This document describes the testing strategy, test coverage, and validation instructions for the SpendLens codebase.

---

## 🧪 Testing Strategy

Since the SpendLens cost-auditor relies on complex logic (pricing rules, tier recommendations, cross-tool overlaps), we employ a **Test-Driven Development (TDD)** pattern. All business logic is isolated into pure functions, allowing us to achieve high test reliability.

We use **Vitest** for running our unit tests because it is fast, requires zero config, and runs out-of-the-box.

---

## 📦 Test Definitions (`tests/audit-engine.test.ts`)

The test suite covers the following core vectors:

1. **Optimal Stacks**:
   - Verifies that a well-optimized stack (e.g., Cursor Pro at 1 seat paying exactly $20) returns `already_optimal` with zero savings.

2. **Cursor Inefficiencies**:
   - Checks that paying more than the listed price (e.g., $100 for 2 seats instead of $40) triggers `reduce_seats`.
   - Checks that paying for the `Business` plan for a small team (e.g., 2 seats) triggers `downgrade_plan` to `Pro`.

3. **ChatGPT vs Claude Redundancies**:
   - Verifies that having both ChatGPT and Claude Team plans triggers consolidation.
   - Ensures that the tool with the larger seat count is recommended for keeping, while the other is recommended for termination.

4. **Cursor vs Copilot Redundancies**:
   - Verifies that having both Cursor and GitHub Copilot selected flags Copilot for cancellation since Cursor has built-in completions.

5. **API Spend Optimizations**:
   - Checks that high API token spend (e.g., Anthropic API at $1000/mo for a 5-person team) suggests switching to Claude Team subscriptions to cap monthly billing.

---

## 🏃 Running Tests

To run the unit tests, execute the following command:

```bash
npm test
```

### Example Test Run Output:
```
 RUN  v3.2.4 C:/Users/atuly/Desktop/SpendLens

 ✓ tests/audit-engine.test.ts (8 tests) 5ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  22:08:57
   Duration  901ms
```

import { describe, it, expect } from "vitest";
import { runAudit } from "../lib/audit-engine/engine";

describe("Audit Engine", () => {
  it("detects Cursor Business overkill for small coding team", () => {
    const result = runAudit({
      tools: [{ toolId: "cursor", plan: "Business", seats: 2, monthlySpend: 80 }],
      teamSize: 2,
      useCase: "coding",
    });
    const cursorAudit = result.tools.find((t) => t.toolId === "cursor");
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
    // Should flag Copilot as redundant when Cursor is present
    const copilotAudit = result.tools.find((t) => t.toolId === "github-copilot");
    expect(copilotAudit?.recommendedAction).toBe("switch_tool");
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
    const audit = result.tools.find((t) => t.toolId === "github-copilot");
    expect(audit?.recommendedAction).toBe("reduce_seats");
  });

  it("detects ChatGPT + Claude overlap in writing workflows", () => {
    const result = runAudit({
      tools: [
        { toolId: "chatgpt", plan: "Plus", seats: 1, monthlySpend: 20 },
        { toolId: "claude", plan: "Pro", seats: 1, monthlySpend: 20 },
      ],
      teamSize: 1,
      useCase: "writing",
    });
    // One of them should be flagged as redundant
    const switchTools = result.tools.filter((t) => t.recommendedAction === "switch_tool");
    expect(switchTools.length).toBeGreaterThanOrEqual(1);
  });

  it("recommends API to subscription switch when API spend is high", () => {
    const result = runAudit({
      tools: [{ toolId: "anthropic-api", plan: "Pay-as-you-go", seats: 1, monthlySpend: 500 }],
      teamSize: 5,
      useCase: "coding",
    });
    const apiAudit = result.tools.find((t) => t.toolId === "anthropic-api");
    expect(apiAudit?.recommendedAction).toBe("switch_tool");
    expect(apiAudit?.monthlySavings).toBeGreaterThan(0);
  });

  describe("INR Auditing", () => {
    it("runs audit in INR and calculates savings correctly without USD runtime conversion errors", () => {
      const result = runAudit({
        tools: [{ toolId: "cursor", plan: "Business", seats: 2, monthlySpend: 7662 }],
        teamSize: 2,
        useCase: "mixed",
        currency: "INR",
      });
      expect(result.currency).toBe("INR");
      
      const cursorAudit = result.tools.find((t) => t.toolId === "cursor");
      expect(cursorAudit?.recommendedAction).toBe("downgrade_plan");
      // expected Pro cost in INR: 20 * 95.78 * 2 = 1916 * 2 = 3832.
      // current spend: 7662. monthlySavings: 7662 - 3832 = 3830.
      expect(cursorAudit?.currentMonthlySpend).toBe(7662);
      expect(cursorAudit?.projectedMonthlySpend).toBe(3832);
      expect(cursorAudit?.monthlySavings).toBe(3830);
      // Verify reason has ₹ and correct INR values
      expect(cursorAudit?.reason).toContain("₹1,916/seat");
    });

    it("evaluates showCredexCTA correctly based on USD-equivalent savings in INR", () => {
      const result = runAudit({
        tools: [
          { toolId: "chatgpt", plan: "Enterprise", seats: 20, monthlySpend: 364000 },
        ],
        teamSize: 15,
        useCase: "mixed",
        currency: "INR",
      });
      // ChatGPT Team: 30 * 95.78 * 20 = 57468. Savings: 364000 - 57468 = 306532 INR.
      // 306532 INR / 95.78 = ~3200 USD. This is > 500 USD, so showCredexCTA should be true.
      expect(result.showCredexCTA).toBe(true);
    });

    it("evaluates isAlreadyOptimal correctly for optimal stacks in INR", () => {
      const result = runAudit({
        tools: [{ toolId: "claude", plan: "Pro", seats: 1, monthlySpend: 1916 }],
        teamSize: 1,
        useCase: "writing",
        currency: "INR",
      });
      expect(result.isAlreadyOptimal).toBe(true);
      expect(result.totalMonthlySavings).toBe(0);
    });
  });
});

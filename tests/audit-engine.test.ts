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
});

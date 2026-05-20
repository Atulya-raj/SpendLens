# SpendLens — AI Prompt Design

This document details the prompt engineering, system instructions, and input payload structure used to generate personalized AI audit summaries.

---

## 🤖 System Instructions

The Claude API is instructed with a clear persona designed to output authoritative, direct, and actionable advice.

**System Prompt:**
> You are a concise financial advisor for startup CTOs and engineering managers. You write in plain English, no jargon, no fluff. You never hallucinate numbers.

---

## 📝 User Prompt Template

We provide Claude with a structured context block representing the audit input and computed metrics:

```markdown
Here is a startup's AI tool audit result:
- Team size: {teamSize}
- Primary use case: {useCase}
- Total current monthly spend: ${result.totalCurrentSpend}
- Total projected monthly spend after optimizations: ${result.totalProjectedSpend}
- Monthly savings: ${result.totalMonthlySavings} ({result.savingsPercent}%)
- Tool-by-tool findings:
{toolFindings}

Write a 80-100 word personalized audit summary paragraph. Be specific to their numbers.
Lead with the biggest saving opportunity. End with one actionable next step.
Do NOT start with "I" or "Your audit shows". Be direct.
```

---

## 🔮 Expected Output Structure

Claude's response should follow these design directives:
1. **Direct Entry**: No conversational filler (e.g., "Certainly! Here is your audit summary...").
2. **Numbers-First**: Lead immediately with the raw facts (e.g., "Consolidating 15 redundant GitHub Copilot seats saves $285/month immediately...").
3. **Actionable Call-to-Action**: End with a concrete step (e.g., "Instruct the team to standardise on Cursor and cancel individual Copilot billings by Friday.").

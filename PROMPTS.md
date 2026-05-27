# SpendLens — AI Prompt Design

This document details the prompt engineering, system instructions, input payload structure, design choices, and failures iterated through to generate personalized AI audit summaries.

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

---

## 💡 Rationale — Why Written This Way?

- **CTO Persona Focus**: Startup CTOs don't have time to read pleasantries. By forcing the LLM to start directly with the core message and use an active voice, the summary reads like a brief from a sharp fractional CFO or finance director rather than an AI chatbot.
- **Variable Injection**: Passing clean, pre-calculated totals (`result.totalCurrentSpend`, etc.) prevents the LLM from attempting arithmetic, which LLMs are notoriously bad at. We rely on the model for natural language synthesis, not calculation.
- **Negative Constraints**: The strict length limit (80-100 words) and phrases like "Do NOT start with..." are critical. Without them, LLMs tend to regurgitate the user prompt in the opening sentence (e.g., "Based on your team size of 15 and use case..."), wasting valuable visual space.

---

## 🛑 What Didn't Work — Failed Iterations

During testing and development, several prompt variants failed or produced poor user experiences:

### Iteration 1: "Act as a helpful friendly chatbot assistant..."
- **Result**: The summary was overly verbose (180+ words), started with polite fluff ("Hope this audit finds you well!"), and used vague recommendations ("You could try to reduce seats").
- **Fix**: Changed the persona to a "concise financial advisor" and forced a direct, professional, almost blunt tone.

### Iteration 2: Asking Claude to calculate the savings
- **Result**: When we only passed raw tool inputs and asked Claude to calculate the sum of savings, it occasionally made minor arithmetic errors (e.g., `$400 - $180 = $210`). Even a $10 error destroys the credibility of a financial auditing tool.
- **Fix**: Calculate all values in the TypeScript audit engine first, then pass the pre-computed totals directly in the prompt text.

### Iteration 3: Lacking negative constraints
- **Result**: The output frequently started with "Here is your personalized audit summary..." or "Your audit shows that you can save...". This added zero value and lowered the professional feel of the report.
- **Fix**: Added explicit negative instructions: `Do NOT start with "I" or "Your audit shows". Be direct.` This successfully forced Claude to lead with the biggest savings opportunity (e.g., "Eliminating redundant Copilot licenses represents your largest quick win...").

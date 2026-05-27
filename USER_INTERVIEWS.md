# SpendLens — User Interviews

Notes from three real conversations with founders building SaaS products. All conducted via cold DMs on X/Twitter during the last week of May 2026.

**Questions asked in every interview:**
1. Walk me through your current AI tool subscriptions. What do you pay, for how many seats?
2. Do you ever feel like you're overpaying? How do you know?
3. Have you ever switched plans or dropped a tool because of cost? What triggered that?
4. If a free tool showed you exactly where you were overspending, what would make you trust it?
5. What would make you not trust it?

---

## Interview 1 — Jimmy Mehta (@jimmy_9126), Founder, SaaS

### Background
Jimmy runs a lean stack: one Gemini Pro subscription, OpenAI via API, and Grok through X Premium. He's considering adding Claude or Codex soon but hasn't pulled the trigger yet.

### Direct Quotes
- "I personally believe in keeping things lean. Using Gemini and OpenAI for my codes and building helps me to have a great control. So right now, I don't feel overpaying."
- "I believe that it will certainly be the case for Claude users where token consumption is very high."
- "A well prepared, clear and honest analysis" — that's what would make him trust a spend audit tool.
- "Trying to fudge the data or exaggerating or things like that which eventually points to purchase of something else. The purchase/recommendation part is still good but it should be genuine."

### The Most Surprising Thing He Said
He unprompted validated our exact target audience: *"I think what you are building is interesting, especially for people who are using Claude and there are many! Most are using Claude or Codex so you have a good audience!"* We hadn't told him who we were targeting — he identified the high-spend Claude user segment on his own.

### What It Changed About Our Design
Jimmy's trust concern — that recommendations shouldn't feel like they're funneling you toward a purchase — directly shaped how we position the Credex CTA. We moved it below the full savings breakdown instead of above it, and we made sure the audit results stand on their own even if the user never clicks the CTA. The tool has to feel like an honest audit first, not a sales pitch with a calculator attached.

---

## Interview 2 — Dairon Canel (@daicandev), Founder, SaaS

### Background
Dairon is a solo founder running Claude Code on the Pro plan. Before Claude Code, he spent a full year on Cursor.

### Direct Quotes
- "Right now just Claude Code. No, Claude Code Pro plan is perfect for me."
- "Yes I tried for a year Cursor, gets expensive really quick."
- On what would make him not trust an audit tool: "I think this question has the wrong angle." He was blunt — he's okay with his spending and doesn't feel the need to audit it.

### The Most Surprising Thing He Said
His one-liner about Cursor — "gets expensive really quick" — was the most interesting part. He didn't elaborate much, but the fact that he churned from Cursor after a full year specifically because of cost validates our audit engine's core rule: flagging Cursor Business plans as overkill for solo developers and tiny teams. He lived the exact scenario our tool detects.

### What It Changed About Our Design
Dairon is a non-target user and that's actually useful to know. He's a solo dev, already on the cheapest plan that works for him, and doesn't feel any spend anxiety. SpendLens shouldn't try to manufacture savings for people like him — our `isAlreadyOptimal` flag exists precisely for this case. His interview reinforced that we need to gracefully handle the "you're spending well" outcome instead of forcing a recommendation where none exists.

---

## Interview 3 — Rahul (@rahulsinghh__), Founder, SaaS

### Background
Rahul is currently on Claude Code's $20 Pro plan. He was previously on the $100 Max plan and downgraded.

### Direct Quotes
- "I feel paying 20 dollars for Claude Code is more bang for the bucks that I'm paying."
- "I was actually using the Claude Code Max plan, which was like hundred dollars, but then I downgraded to the 20 dollar — not necessarily because it was not value for money. I felt it was just that in my use case I didn't require that much compute at that moment."
- "If I could get a tool that could tell me that if I'm overspending on tokens or on AI uses and if it's able to give me an alternative where I would be getting the same output, same quality with less spending, I would definitely get it."
- "If you want to make people believe in your product, to trust your product, you have to make it look really nice and be very clear with the messaging that you are doing."

### The Most Surprising Thing He Said
Rahul is living proof that our `downgrade_plan` rule works in the real world. He went from the $100 Claude Max plan to the $20 Pro plan — not because Max was bad, but because he realized his actual compute needs didn't justify the 5x price difference. He made this decision manually, on gut feel. SpendLens would have flagged this automatically on day one.

### What It Changed About Our Design
His last quote — about trust coming from looking polished and having clear messaging — validated the amount of time we spent on the premium sand-and-navy visual design instead of shipping a bare-bones MVP. A startup CTO evaluating a financial tool judges credibility partly on how it looks. If the UI feels cheap, the recommendations feel cheap. Rahul confirmed that instinct.
